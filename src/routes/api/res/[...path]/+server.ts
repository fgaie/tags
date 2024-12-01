import { readFile } from "fs/promises";
import type { RequestHandler } from "./$types";
import { error } from "@sveltejs/kit";
import { DATABASE_URL } from "$env/static/private";
import * as path from "node:path";

export const GET = (async ({ params }) => {
  try {
    return new Response(
      await readFile(path.dirname(DATABASE_URL) + "/" + params.path),
    );
  } catch (e) {
    console.error({ error: e });
    throw error(404);
  }
}) satisfies RequestHandler;
