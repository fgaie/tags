import type { RequestHandler } from "./$types";
import * as db from "$lib/server/db";

export type TagsData = db.Tag[];
export const GET = (async () => {
  // const q = url.searchParams.get("q");

  const tags = (await db.getTags()) ?? [];

  return Response.json(tags satisfies TagsData);
}) satisfies RequestHandler;
