import type {PageServerLoad} from "./$types";
import {error, redirect} from "@sveltejs/kit";
import {env as env} from "$env/dynamic/private";
import {env as envP} from "$env/dynamic/public";
import {generateToken} from "$lib/tokens";
import {getGmodstorePurchases} from "$lib/gmodstore";
import {giveRole, ids} from "$lib/discord";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
}

interface DiscordConnection {
  id: string;
  name: string;
  type: string;
  friend_sync: boolean;
  metadata_visibility: number;
  show_activity: boolean;
  two_way_link: boolean;
  verified: boolean;
  visibility: number;
}

interface GmodstorePurchase {
  id: string;
  userId: string;
  productId: string;
  revoked: boolean;
  createdAt: string;
  updatedAt: string;
}

type SteamAccounts = DiscordConnection[];

export const load: PageServerLoad = async (event) => {
  const searchParams = event?.url?.searchParams;
  const code = searchParams.get("code");

  if (!searchParams || !code) {
    return redirect(302, "/discord/redirect");
  }

  const accessToken = await getDiscordAccessToken(code).catch(() => {
    throw error(500, "Failed to get Discord user.");
  });

  let discordUser, steamAccounts;

  try {
    [discordUser, steamAccounts] = await Promise.all([
      getDiscordUser(accessToken),
      getSteamAccounts(accessToken),
    ]);
  } catch (err) {
    console.error(err);
    throw error(500, "Failed to get Discord user.");
  }

  const token = generateToken();

  const discordUserId = discordUser.id;

  const data = await fetch(`${env.BACKEND_URL}/user/${discordUserId}/discord`, {
    method: "GET",
    headers: {
      "Authorization": env.BACKEND_API_KEY,
      "Content-Type": "application/json",
    },
  }).then((res) => res.json()).catch(() => {
    throw error(500, "Failed to get user data.");
  });

  if (data?.id) {
    await giveDiscordRoles(discordUserId, data.gmodstoreId);
    return redirect(302, "/success");
  }

  return {
    discordUser,
    steamAccounts,
    token,
  };
};

async function giveDiscordRoles(discordId: string, gmodstoreId: string) {
  console.log("Attempting to give roles to user", discordId, "with gmodstore id", gmodstoreId)
  const purchases: GmodstorePurchase[] = await getGmodstorePurchases(
    gmodstoreId,
  );
  if (!purchases) {
    console.log("No purchases found for user", discordId)
    return;
  }

  const roles = purchases.map((purchase) => {
    return ids[purchase.productId];
  });

  if (!roles || roles.length === 0) {
    console.log("No roles found for user", discordId)
    return;
  }

  console.log("Giving roles to user", discordId, roles);
  await giveRole(discordId, "937472368970977322");

  roles.forEach((role, index) => {
    console.log(`Giving role ${role} (${index}) to user ${discordId}`)
    giveRole(discordId, role);
  });
}

async function getDiscordAccessToken(code: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("client_id", envP.PUBLIC_DISCORD_CLIENT_ID);
  params.append("client_secret", env.DISCORD_CLIENT_SECRET);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", envP.PUBLIC_DISCORD_REDIRECT_URI);

  return await fetch(`https://discord.com/api/oauth2/token`, {
    method: "POST",
    body: params,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.error) {
        console.error(data);
        throw error(500, "Failed to get Discord access token.");
      }

      return data.access_token;
    })
    .catch((err) => {
      console.error(err);
      throw error(500, "Failed to get Discord access token.");
    });
}

async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`https://discord.com/api/users/@me`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.error) {
        console.error(data);
        throw error(500, "Failed to get Discord user.");
      }

      return data;
    })
    .catch((err) => {
      console.error(err);
      throw error(500, "Failed to get Discord user.");
    });

  return {
    id: response.id,
    username: response.username,
    avatar:
      `https://cdn.discordapp.com/avatars/${response.id}/${response.avatar}.png`,
  };
}

async function getSteamAccounts(accessToken: string): Promise<SteamAccounts> {
  return await fetch(`https://discord.com/api/v10/users/@me/connections`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.error) {
        console.error(data);
        throw error(500, "Failed to get Discord user.");
      }

      return data.filter((connection: DiscordConnection) =>
        connection.type === "steam"
      );
    })
    .catch((err) => {
      console.error(err);
      throw error(500, "Failed to get Discord user.");
    });
}
