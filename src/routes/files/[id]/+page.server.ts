import type { Actions } from "./$types";
import * as db from "$lib/server/db";
import { fail, redirect } from "@sveltejs/kit";
import { unlink } from "node:fs/promises";
import { DATABASE_URL } from "$env/static/private";
import * as path from "node:path";

export const actions = {
  addTag: async ({ request, params }) => {
    const { id } = params;
    const data = await request.formData();
    const tag = data.get("tag")?.toString();

    if (!tag) {
      return fail(400, { error: "No tag given", tag });
    }

    const dbtag = await db.findOrAddTag({ name: tag });
    if (dbtag.error !== undefined) {
      return fail(400, { error: dbtag.error, tag });
    }

    const err = await db.tagFile({ file: +id, tag: dbtag.id });
    if (err) {
      return fail(400, { error: err.error, tag });
    }
  },

  delete: async ({ params, url }) => {
    const { id } = params;

    const res = await db.deleteFile({ id: +id });
    if (!res) {
      return fail(404, { error: "unknown file" });
    }

    const file = path.dirname(DATABASE_URL) + "/" + res.path;
    await unlink(file);
    console.log(`deleted ${file}`);

    return redirect(302, url.searchParams.get("redirect") ?? "/files");
  },
} satisfies Actions;
