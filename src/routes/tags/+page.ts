import type { PageLoad } from "./$types";
import type { TagsData } from "../api/tags/+server";

export const load = (async ({ fetch, url }) => {
  const res = await fetch(`/api/tags${url.search}`);
  const tags = (await res.json()) as TagsData;

  return {
    title: `Tags (${tags.length})`,
    tags,
  };
}) satisfies PageLoad;
