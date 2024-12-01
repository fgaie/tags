<script lang="ts">
  import "../app.css";
  import ThemeSwitcher from "$lib/components/ThemeSwitcher.svelte";
  import { page } from "$app/stores";

  let { children } = $props();
</script>

<svelte:head>
  {#if $page.data?.title}
    <title>{$page.data.title}</title>
  {/if}
</svelte:head>

<header
  class="sticky top-0 bg-base-200 w-full space-between flex items-center shadow-lg z-[1] p-2"
>
  <nav class="items-center px-2 flex gap-2">
    <a class="link link-hover" href="/files">Files</a>
    <a class="link link-hover" href="/tags">Tags</a>
  </nav>
  <div class="grow text-center truncate px-2">
    {#if $page.data?.title}
      {$page.data.title}
    {/if}
  </div>
  <div class="grid items-end px-2">
    <ThemeSwitcher class="w-min" />
  </div>
</header>

<main class="grid grid-cols-1 place-items-center">
  <div class="w-full md:max-w-[theme(screens.lg)]">
    {@render children()}
  </div>
</main>
