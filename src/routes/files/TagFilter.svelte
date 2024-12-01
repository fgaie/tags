<script lang="ts">
  import type { Tag } from "$lib/server/db";
  import { page } from "$app/stores";

  const {
    tags,
    disabled = false,
  }: {
    tags: Tag[];
    disabled?: boolean;
  } = $props();

  type Mode = 0 | 1 | 2;
  let tagsWithState = $state(tags.map((tag) => ({ ...tag, mode: 0 as Mode })));
  $effect(() => {
    tags;
    const included = $page.url.searchParams.getAll("include").map(Number);
    const excluded = $page.url.searchParams.getAll("exclude").map(Number);

    tagsWithState = tags.map((tag) => ({
      ...tag,
      mode: included.includes(tag.id) ? 1 : excluded.includes(tag.id) ? 2 : 0,
    }));
  });

  const included = $derived(tagsWithState.filter(({ mode }) => mode === 1));
  const excluded = $derived(tagsWithState.filter(({ mode }) => mode === 2));
</script>

<details class="dropdown dropdown-botton dropdown-hover">
  <summary
    class="btn btn-sm flex justify-between"
    class:btn-disabled={disabled || tags.length === 0}
  >
    <span>Tags</span>
    {#if included.length > 0}<span class="badge badge-sm badge-success"
        >{included.length}</span
      >{/if}
    {#if excluded.length > 0}<span class="badge badge-sm badge-error"
        >{excluded.length}</span
      >{/if}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6 -mr-2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
      />
    </svg>
  </summary>

  <div
    class="dropdown-content mt-2 bg-base-300 text-base-content rounded-box z-[1] w-max max-w-64 sm:max-w-96 p-2 shadow"
  >
    <ul class="flex gap-2 flex-wrap">
      {#each tagsWithState as tag (tag.id)}
        <li>
          {#if tag.mode === 0}
            <button
              class="badge"
              onclick={(e) => (e.preventDefault, (tag.mode = 1))}
            >
              {tag.name}
            </button>
          {:else if tag.mode === 1}
            <button
              class="badge badge-success"
              onclick={(e) => (e.preventDefault(), (tag.mode = 2))}
            >
              {tag.name}
            </button>
            <input type="hidden" name="include" value={tag.id} />
          {:else}
            <button
              class="badge badge-error"
              onclick={(e) => (e.preventDefault(), (tag.mode = 0))}
            >
              {tag.name}
            </button>
            <input type="hidden" name="exclude" value={tag.id} />
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</details>
