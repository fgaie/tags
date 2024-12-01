<script lang="ts" generics="T">
  import type { Snippet } from "svelte";

  const {
    items,
    item: itemf,
    intro,
    outro,
    key = (x) => x,
  }: {
    items: T[];
    item: Snippet<[T]>;
    key?: (x: T) => any;
    intro?: Snippet<[]>;
    outro?: Snippet<[]>;
  } = $props();
</script>

<div
  class="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(theme(spacing.60),1fr))] grid-rows-[masonry] gap-2"
>
  {#if intro}
    {@render intro()}
  {/if}

  {#each items as item (key(item))}
    {@render itemf(item)}
  {/each}

  {#if outro}
    {@render outro()}
  {/if}
</div>
