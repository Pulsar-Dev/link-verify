<script lang="ts">
  import type {PageServerData} from "./$types";
  import Logo from "$components/Logo.svelte";
  import SteamAccount from "$components/SteamAccount.svelte";
  import {goto} from "$app/navigation";

  export let data: PageServerData;
  let userLinkClicked: boolean = false;

  interface UserAccountClickData {
    success: boolean;
    error?: string;
  }

  let userAccountClickData: UserAccountClickData

  const handleAccountClick = (event: any) => {
    if (userLinkClicked) return;
    userLinkClicked = true;

    const id: string = event.detail.id;

    fetch("/discord/user", {
      method: "POST",
      body: JSON.stringify({
        steamId: id,
        discordId: data.discordUser.id
      }),
      headers: {
        "Content-Type": "application/json",
        "token": data.token
      }
    }).then((res) => res.json()).then((data) => {
      userAccountClickData = data;
      if (data.success) {
        goto("/success")
      }
    }).catch((err) => {
      console.log(err)
      userLinkClicked = false;
      userAccountClickData = {
        success: false,
        error: "An error occurred while trying to link your account. Please try again later."
      }
    });
  }
</script>

{#if data.steamAccounts.length === 0 || userAccountClickData?.success === false}
  <div class="flex items-center justify-center align-center min-h-screen">
    <div class={"w-96 -mt-24"}>
      <div class="flex justify-center w-full mb-6">
        <div class="w-2/3">
          <Logo/>
        </div>
      </div>
      <div class="min-w-full">
        <h1 class="text-lg text-white text-center mb-2">{ userAccountClickData.error ?? "You do not have any Steam accounts linked!" }</h1>

        <a
            class="rounded-md flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white py-2 px-4"
            href={"/discord/redirect"}
        >
          <h1 class="text-lg text-center">
            Retry
          </h1>
        </a>

        {#if data.steamAccounts.length === 0}
          <div class="mt-4">
            <h2 class="text-lg text-gray-200">How do I add a connection?</h2>
            <p class="text-gray-300">Please look at <a class="text-blue-400 underline"
                                                       href="https://support.discord.com/hc/en-us/articles/8063233404823-Connections-Linked-Roles-Community-Members">this
              Discord article</a> to find out how to add connections</p>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="flex flex-col items-center justify-center align-center py-12">
    <div class="">
      <div class="flex justify-center w-full mb-6">
        <div class="w-1/2">
          <Logo/>
        </div>
      </div>
      <div class="text-center">
        <h1 class="text-2xl font-bold text-gray-50 dark:text-white mb-2">
          Hey {data.discordUser.username}!
        </h1>
        <h2 class="text-xl font-semibold text-gray-100 mb-4">
          Please select the correct Steam account.
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div
            class="rounded-md shadow-md px-2 pt-2 bg-black bg-opacity-20 backdrop-filter backdrop-blur transition-colors duration-200"
        >
          {#each data.steamAccounts as account, index (account.id)}
            <div class="mb-2">
              <SteamAccount
                  id={account.id}
                  name={account.name}
                  canClick={!userLinkClicked}
                  on:click={handleAccountClick}
                  userLinkClicked={userLinkClicked}
              />
            </div>
          {/each}
        </div>
      </div>
      <p class="text-sm text-gray-200 mt-3 mx-4">
        If you don't see your account, please make sure it's linked to your Discord.
      </p>
    </div>
  </div>
{/if}