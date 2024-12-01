import type { RequestHandler } from "./$types";
import * as db from "$lib/server/db";
import { error } from "@sveltejs/kit";

export type FileData = NonNullable<Awaited<ReturnType<typeof db.getFile>>>;
export const GET = (async ({ params }) => {
  const id = +params.id;

  const file = await db.getFile({ id });

  if (!file) {
    throw error(404, "file not found");
  }

  return Response.json(file);
}) satisfies RequestHandler;
