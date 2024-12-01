import type { PageLoad } from "./$types";
import type { FileData } from "../../api/files/[id]/+server";
import type { TagsData } from "../../api/tags/+server";

export const load = (async ({ url, fetch, params }) => {
  const fres = await fetch(`/api/files/${params.id}${url.search}`);
  const file: FileData = await fres.json();

  const tres = await fetch(`/api/tags`);
  const tags: TagsData = await tres.json();

  return {
    title: file.path,
    file,
    tags,
  };
}) satisfies PageLoad;
