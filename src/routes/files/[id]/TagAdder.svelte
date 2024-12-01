<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";
  import { enhance } from "$app/forms";
  import { onMount, tick } from "svelte";

  let {
    tags,
    value = $bindable(""),
    selected = $bindable(0),
    class: clazz = "",
  }: {
    tags: string[];
    value?: string;
    selected?: number;
    class?: string;
  } = $props();

  let tagsCanonized = $derived(
    tags.map((name) => ({ name, canon: name.toLowerCase() })),
  );

  let lowerValue = $derived(value.toLowerCase());
  let filtered: string[] = $derived(
    tagsCanonized
      .filter((name) => name.canon.includes(lowerValue))
      .map(({ name }) => name),
  );

  $effect(() => {
    value;
    selected = 0;
  });

  const onkeydown: SvelteHTMLElements["input"]["onkeydown"] = (event) => {
    if (event.code == "Enter" && selected !== 0) {
      value = filtered[selected - 1];
      selected = 0;
      event.preventDefault();
    } else if (event.code === "ArrowUp") {
      selected = Math.max(0, selected - 1);
      event.preventDefault();
    } else if (event.code === "ArrowDown") {
      selected = Math.min(filtered.length, selected + 1);
      event.preventDefault();
    }
  };

  let input: HTMLInputElement | undefined = undefined;
  const enhanced = () => {
    return async ({ update }: any) => {
      await update();
      await tick();
      input?.focus();
    };
  };

  onMount(() => {
    input?.focus();
  });
</script>

<form
  class="relative group outline-outset-2 outline-primary outline-2 {clazz}"
  class:focus-within:outline={selected === 0}
  method="POST"
  action="?/addTag"
  autocomplete="off"
  use:enhance={enhanced}
>
  <div class="grid grid-cols-[1fr,auto]">
    <input
      class="focus:ring-0 bg-inherit border-none"
      placeholder="new tag"
      type="text"
      name="tag"
      {onkeydown}
      bind:value
      bind:this={input}
    />
    <button
      aria-label="add tag"
      class="p-2 focus:outline-none focus:text-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
    </button>
  </div>

  {#if filtered.length > 0 || value}
    <ul
      class="hidden group-focus-within:block absolute outline-outset-2 outline-top-0 outline-neutral outline-2 outline w-full insets-x top-[calc(100%+4px)] max-h-80 overflow-y-scroll"
    >
      {#each filtered as completion, i}
        <button
          onclick={(e) => (
            e.preventDefault(), (value = completion), input?.focus()
          )}
          class="text-start w-full bg-base-100 p-2 hover:bg-primary hover:text-primary-content"
          class:odd:bg-base-200={selected !== i + 1}
          class:bg-primary={selected === i + 1}
          class:text-primary-content={selected === i + 1}
        >
          {completion}
        </button>
      {:else}
        <li class="bg-base-200 p-2 outline-primary outline-2">
          create "{value}"
        </li>
      {/each}
    </ul>
  {/if}
</form>
