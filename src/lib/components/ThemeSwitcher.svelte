<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  const themes: string[] = ["light", "dark", "wireframe", "black"];
  var current: string = $state("dark");

  const { class: clazz = "", ...props }: SvelteHTMLElements["div"] = $props();

  $effect(() => {
    current = localStorage.getItem("theme") ?? "dark";
  });

  $effect(() => {
    localStorage.setItem("theme", current);
  });
</script>

<div {...props} class="dropdown dropdown-end {clazz}">
  <div role="button" tabindex="0" class="btn btn-sm">Theme</div>
  <!-- .dropdown-content needs to be interactive -->
  <button
    class="cursor-default dropdown-content bg-base-300 rounded-box z-[1] w-52 mt-2 p-2 shadow flex flex-col gap-2"
  >
    {#each themes as theme}
      <label
        data-theme={theme}
        class="bg-base-100 grid grid-cols-[1fr,auto] p-2 cursor-pointer"
      >
        <span class="text-start">{theme}</span>
        <div class="h-full flex gap-1">
          <div class="h-full w-2 bg-primary rounded-badge"></div>
          <div class="h-full w-2 bg-secondary rounded-badge"></div>
          <div class="h-full w-2 bg-accent rounded-badge"></div>
          <div class="h-full w-2 bg-neutral rounded-badge"></div>
        </div>

        <input
          type="radio"
          name="theme"
          value={theme}
          class="hidden theme-controller"
          bind:group={current}
        />
      </label>
    {/each}
  </button>
</div>

<style>
  label {
    border-radius: calc(var(--rounded-box) - theme(spacing.2));
  }
</style>
