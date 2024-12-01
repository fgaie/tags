import * as db from "$lib/server/db";

export type POSTResponse = { modified: number };
export const POST = async () => {
  await db.reloadFiles();
  return Response.json({ ok: true });
};
