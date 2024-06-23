<script lang="ts">
  import {createEventDispatcher} from "svelte";

  export let id: string;
  export let name: string;
  export let canClick: boolean = true;
  export let userLinkClicked: boolean;

  let loading: boolean = false;
  const dispatch = createEventDispatcher();

  const linkClick = () => {
    loading = true;
    dispatch('click', {id});
  }

</script>

<div class="flex justify-between items-center bg-gray-800 bg-opacity-70 rounded-lg p-4 shadow-md">
  <div>
    <h1 class="text-2xl text-white font-semibold">{name}</h1>
    <h2 class="text-sm text-gray-400">{id}</h2>
  </div>
  <div>
    {#if !loading}
      <button
          class={`flex items-center justify-center px-4 py-2 rounded-md text-white font-semibold ${
							!userLinkClicked ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 cursor-not-allowed'
						}`}
          on:click={() => canClick && linkClick()}
      >
        Select
      </button>
    {:else}
      <div class="flex items-center justify-center">
        <svg
            class="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
          <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
          ></circle>
          <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    {/if}
  </div>
</div>