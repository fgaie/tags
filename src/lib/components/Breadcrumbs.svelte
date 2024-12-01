<script lang="ts">
  const { url }: { url: string } = $props();

  const tokens = $derived(url.split("/").filter((s) => s !== ""));
  const crumbs = $derived.by(() => {
    let tokenPath = "";
    const crumbs = tokens.map((t) => {
      tokenPath += `/${t}`;
      t = t.charAt(0).toUpperCase() + t.slice(1);
      return { label: t, href: tokenPath };
    });
    crumbs.unshift({ label: "Home", href: "/" });
    return crumbs;
  });
</script>

<div class="breadcrumbs text-sm">
  <ul>
    {#each crumbs as crumb (crumb.href)}
      <li><a href={crumb.href}>{crumb.label}</a></li>
    {/each}
  </ul>
</div>
