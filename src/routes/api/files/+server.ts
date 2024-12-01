import type { RequestHandler } from "./$types";
import * as db from "$lib/server/db";

export type FilesData = { files: db.File[]; total: number; next: string };
export const GET = (async ({ url }) => {
  var limit = +(url.searchParams.get("limit") ?? 25);
  const offset = +(url.searchParams.get("offset") ?? 0);
  const untagged = url.searchParams.get("untagged") !== null;
  const include = url.searchParams.getAll("include").map(Number);
  const exclude = url.searchParams.getAll("exclude").map(Number);

  const files = await db.getFiles({
    untagged,
    limit,
    offset,
    tagWhitelist: include,
    tagBlacklist: exclude,
  });

  var params = new URLSearchParams(url.search);
  params.set("offset", `${offset + files.files.length}`);

  return Response.json({
    files: files.files,
    total: files.total,
    next: `/api/files?${params}`,
  } as FilesData);
}) satisfies RequestHandler;
