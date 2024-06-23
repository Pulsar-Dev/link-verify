<script lang="ts">
  import Logo from "$components/Logo.svelte";
</script>

<div class={"w-96 -mt-24"}>
  <div class="flex justify-center w-full mb-6">
    <div class="w-2/3">
      <Logo/>
    </div>
  </div>
  <div class="min-w-full">
    <a
        class="rounded-md flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
        href="/discord/redirect"
    >
      <h1 class="text-lg text-center">
        Login with Discord
      </h1>
    </a>
  </div>
</div>
