<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  const { class: clazz, ...props }: SvelteHTMLElements["img"] = $props();
</script>

<img
  class="object-cover bg-black rounded-box w-full border-neutral border-2 {clazz}"
  {...props}
/>
