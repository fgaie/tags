import {
  sqliteTable,
  integer,
  text,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

export const tags = sqliteTable("tags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  modifiedAt: integer("modified_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  path: text("path").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  exists: integer("exists", { mode: "boolean" }).notNull().default(true),
});

export const fileTags = sqliteTable(
  "files_to_tags",
  {
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade", onUpdate: "cascade" }),
    fileId: integer("file_id")
      .notNull()
      .references(() => files.id, { onDelete: "cascade", onUpdate: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({
      name: "files_to_tags_pk",
      columns: [t.tagId, t.fileId],
    }),
  }),
);

export const fileTagsRelation = relations(fileTags, ({ one }) => ({
  file: one(files, {
    fields: [fileTags.fileId],
    references: [files.id],
  }),
  tag: one(tags, {
    fields: [fileTags.tagId],
    references: [tags.id],
  }),
}));

export const fileFileTagsRelation = relations(files, ({ many }) => ({
  tags: many(fileTags),
}));

export const tagsFileTagsRelation = relations(tags, ({ many }) => ({
  files: many(fileTags),
}));
