import type { PageLoad } from "./$types";
import type { FilesData } from "../api/files/+server";
import type { TagsData } from "../api/tags/+server";

export const load = (async ({ url, fetch }) => {
  const fres = await fetch(`/api/files${url.search}`);
  const files = (await fres.json()) as FilesData;

  const tres = await fetch(`/api/tags`);
  const tags = (await tres.json()) as TagsData;

  return {
    title: `Files (${files.total})`,
    ...files,
    tags: tags,
  };
}) satisfies PageLoad;
