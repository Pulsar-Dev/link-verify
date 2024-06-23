import type {PageLoad} from "./$types";
import {env} from '$env/dynamic/public';
import {redirect} from "@sveltejs/kit";

export const load: PageLoad = async () => {

  const clientId = env.PUBLIC_DISCORD_CLIENT_ID;
  const responseType = "code";
  const redirectUri = env.PUBLIC_DISCORD_REDIRECT_URI;
  const scope = "connections+identify";

  const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`;

  redirect(302, discordUrl)
};