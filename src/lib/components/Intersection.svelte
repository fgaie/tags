<script lang="ts">
  import { onMount } from "svelte";

  let div: HTMLDivElement | undefined = undefined;

  let { onintersect }: { onintersect: () => void } = $props();

  onMount(() => {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onintersect();
      }
    });

    if (div) {
      obs.observe(div);
    }

    return () => obs.disconnect();
  });
</script>

<div bind:this={div}></div>
