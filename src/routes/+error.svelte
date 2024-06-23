<script>
    import { page } from "$app/stores";
</script>

<h1 class="text-5xl font-bold text-center text-white">
  {$page.status} | {$page?.error?.message}
</h1>