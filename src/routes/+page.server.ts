import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ fetch }) => {
  await (await fetch("/api/reload", { method: "POST" })).json();
  redirect(302, "/files");
}) satisfies PageServerLoad;
