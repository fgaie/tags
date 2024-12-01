import { fail, type Actions } from "@sveltejs/kit";
import * as db from "$lib/server/db";

export const actions = {
  new: async ({ request }) => {
    const data = await request.formData();
    const name = data.get("name")?.toString();

    if (!name) {
      return fail(400, { error: "No name given" });
    }

    const res = await db.addTag({ name });
    if (res.error !== undefined) {
      return fail(400, { error: res.error });
    }
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id");

    if (!id) {
      return fail(400, { error: "No id given" });
    }

    const res = await db.deleteTag({ id: +id });
    if (!res) {
      return fail(404, { error: `tag ${id} not found` });
    }
  },
} satisfies Actions;
