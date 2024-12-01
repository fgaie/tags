<script lang="ts">
  import Image from "$lib/components/Image.svelte";
  import Intersection from "$lib/components/Intersection.svelte";
  import Masonry from "$lib/components/Masonry.svelte";
  import type { PageData } from "./$types";
  import TagFilter from "./TagFilter.svelte";
  let { data }: { data: PageData } = $props();
  import { page } from "$app/stores";

  let current: PageData = $state(data);
  let files: PageData["files"] = $state(data.files);
  let untagged = $state(!!($page.url.searchParams.get("untagged") ?? false));

  let fetching: boolean = $state(false);
  async function refetch() {
    if (fetching) return;
    fetching = true;

    const res = await fetch(current.next);
    current = await res.json();
    files = files.concat(current.files);
    fetching = false;
  }

  $effect(() => {
    data;
    current = data;
    files = data.files;
    fetching = false;
  });
</script>

<div class="grid grid-cols-1 gap-2 p-2">
  <form method="GET" class="w-full flex space-between items-center gap-2">
    <label>
      <input
        type="checkbox"
        name="untagged"
        bind:checked={untagged}
        class="checkbox checkbox-sm"
      />
      untagged only
    </label>
    <TagFilter disabled={untagged} tags={data.tags} />
    <div class="divider grow m-0 my-auto"></div>
    <button class="btn"> Filter </button>
  </form>

  <Masonry items={files} key={({ id }) => id}>
    {#snippet item(file)}
      <a
        href="/files/{file.id}{$page.url.search}"
        class="sm:hover:scale-110 duration-100 ease-in-out"
      >
        <Image
          class="hover:border-primary max-sm:w-screen size-full"
          src="/api/res/{file.path}"
          alt={file.path}
        />
      </a>
    {/snippet}

    {#snippet outro()}
      <Intersection onintersect={refetch} />
    {/snippet}
  </Masonry>

  {#if fetching}
    <div class="w-full p-2 grid grid-cols-1 place-items-center">
      <div class="loading loading-spinner loading-xl"></div>
    </div>
  {/if}
</div>
