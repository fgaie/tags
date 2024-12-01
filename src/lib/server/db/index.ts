import { env } from "$env/dynamic/private";
import { DATABASE_URL } from "$env/static/private";
import { walkSync } from "@nodelib/fs.walk";
import Database from "better-sqlite3";
import { and, count, eq, inArray, notInArray, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = new Database(env.DATABASE_URL);
const db = drizzle(client, { schema });
import * as path from "node:path";

export type File = typeof schema.files.$inferSelect;
export type Files = { files: File[]; total: number };
export async function getFiles({
  untagged = false,
  limit = Infinity,
  offset = 0,
  tagWhitelist = [],
  tagBlacklist = [],
}: {
  untagged?: boolean;
  limit?: number;
  offset?: number;
  tagWhitelist?: number[];
  tagBlacklist?: number[];
}): Promise<Files> {
  let conditions = [eq(schema.files.exists, true)];

  if (untagged) {
    conditions.push(
      notInArray(
        schema.files.id,
        db.select({ id: schema.fileTags.fileId }).from(schema.fileTags),
      ),
    );
  } else {
    conditions.push(
      notInArray(
        schema.files.id,
        db
          .select({ id: schema.fileTags.fileId })
          .from(schema.fileTags)
          .where(inArray(schema.fileTags.tagId, tagBlacklist)),
      ),
    );

    conditions = conditions.concat(
      tagWhitelist.map((tag) =>
        inArray(
          schema.files.id,
          db
            .select({ id: schema.fileTags.fileId })
            .from(schema.fileTags)
            .where(eq(schema.fileTags.tagId, tag)),
        ),
      ),
    );
  }

  const where = and(...conditions);

  const total = await db
    .select({ count: count() })
    .from(schema.files)
    .where(where);

  const filesl = await db.query.files.findMany({
    orderBy: (files, { asc: desc }) => desc(files.createdAt),
    limit,
    offset,
    where,
    with: {
      tags: true,
    },
  });

  return { total: total[0].count, files: filesl };
}

export type Tag = typeof schema.tags.$inferSelect;
export type FileWithTags = File & { tags: Tag[] };

export async function getFile({
  id,
}: {
  id: number;
}): Promise<FileWithTags | null> {
  const file = (await db.query.files.findFirst({
    where: eq(schema.files.id, id),
    with: {
      tags: {
        with: {
          tag: true,
        },
      },
    },
  })) as any;

  return file ? { ...file, tags: file.tags.map(({ tag }: any) => tag) } : null;
}

export async function getTags(): Promise<Tag[] | null> {
  const tags = (await db.query.tags.findMany({
    orderBy: (tags, { desc }) => desc(tags.modifiedAt),
  })) as any;

  return tags ?? null;
}

export async function getTag({ id }: { id: number }): Promise<Tag | null> {
  const tag = (await db.query.tags.findFirst({
    where: eq(schema.tags.id, id),
  })) as any;

  return tag ?? null;
}

export async function findTag({ name }: { name: string }): Promise<Tag | null> {
  const tag = (await db.query.tags.findFirst({
    where: eq(schema.tags.name, name),
  })) as any;

  return tag ?? null;
}

export async function addTag({
  name,
}: {
  name: string;
}): Promise<(Tag & { error: undefined }) | { error: string }> {
  const res = await db
    .insert(schema.tags)
    .values({ name })
    .onConflictDoNothing()
    .returning();
  if (res.length < 1) {
    return { error: `${name} already exists` };
  }

  return { ...res[0], error: undefined };
}

export async function findOrAddTag({
  name,
}: {
  name: string;
}): Promise<(Tag & { error: undefined }) | { error: string }> {
  const dbtag = await findTag({ name });
  if (dbtag) {
    return { ...dbtag, error: undefined };
  }

  return await addTag({ name });
}

export async function tagFile({
  file,
  tag,
}: {
  file: number;
  tag: number;
}): Promise<{ error: string } | null> {
  try {
    const res = await db
      .insert(schema.fileTags)
      .values({ fileId: file, tagId: tag })
      .onConflictDoNothing();

    if (res.changes === 0) {
      return { error: `Already tagged ${tag}` };
    }
  } catch (e) {
    console.error({ error: e });
    return { error: JSON.stringify(e) };
  }

  await db
    .update(schema.tags)
    .set({ modifiedAt: sql`(unixepoch())` })
    .where(eq(schema.tags.id, tag));

  return null;
}

export async function deleteTag({ id }: { id: number }): Promise<boolean> {
  const res = await db.delete(schema.tags).where(eq(schema.tags.id, +id));
  return res.changes !== 0;
}

export async function reloadFiles(): Promise<void> {
  await db.update(schema.files).set({ exists: false });

  const allfiles = walkSync(path.dirname(DATABASE_URL), {
    basePath: "",
    stats: true,
    deepFilter: ({ path }) => !path.startsWith("."),
    entryFilter: ({ name, dirent }) =>
      !dirent.isDirectory() &&
      [".jpg", ".png", ".gif", ".webm"].some((ext) => name.endsWith(ext)),
  });

  await db
    .insert(schema.files)
    .values(
      allfiles.map((entry) => ({
        path: entry.path,
        createdAt: entry.stats?.ctime ?? new Date(),
      })),
    )
    .onConflictDoUpdate({ target: schema.files.path, set: { exists: true } });
}

export async function deleteFile({ id }: { id: number }): Promise<File | null> {
  const res = await db
    .delete(schema.files)
    .where(eq(schema.files.id, id))
    .returning();
  return res.length > 0 ? res[0] : null;
}
