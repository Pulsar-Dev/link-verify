<script>
    import "../app.css";
    import { page } from "$app/stores";

    let pageTitle = $page.route.id || "";

    // Capitalize the first letter of the page title and remove the /
    pageTitle = pageTitle.replace("/", " ").charAt(1).toUpperCase() + pageTitle.slice(2);
</script>

<svelte:head>
  <title>Pulsar Verify {pageTitle ? '| ' + pageTitle : ''}</title>
</svelte:head>

<div class="flex items-center justify-center align-center min-h-screen bg-pattern bg-contain">
  <slot></slot>
</div>