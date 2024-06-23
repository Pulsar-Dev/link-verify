<script lang="ts">
  import Logo from "$components/Logo.svelte";

  let error: string;
</script>

{#if error}
  <div class="flex flex-col items-center justify-center">
    <div class="max-w-md w-full space-y-8">
      <div class="flex justify-center w-full">
        <div class="w-1/2">
          <Logo/>
        </div>
      </div>
      <div class="mt-6 text-center">
        <h1 class="text-3xl font-extrabold text-gray-100">
          It seems like an error has occurred:
        </h1>
        <h2 class="mt-2 text-xl font-semibold text-red-400">{error}</h2>
        <p class="mt-2 text-sm text-gray-400">
          If you think this is an error, please contact an administrator.
        </p>
      </div>
    </div>
  </div>
{/if}