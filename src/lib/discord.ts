import {env as env} from "$env/dynamic/private";
import {env as envP} from "$env/dynamic/public";

interface Ids {
  [key: string]: string;
}

export const ids: Ids = {
  "ea226a1e-7b77-43e4-92a0-34e8e60a2701": "937472481604796418", // Store Legacy
  "4d6ed0b3-eb58-45b9-aceb-95686a284b5c": "1125229478440874014", // Store
  "b853b226-a31f-4806-8a72-fa18717f2723": "1099742893163429959", // Custom Jobs
};

export async function giveRole(discordId: string, roleId: string) {
  const data = await fetch(`https://discord.com/api/v10/guilds/${envP.PUBLIC_DISCORD_GUILD_ID}/members/${discordId}/roles/${roleId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bot ${env.DISCORD_BOT_TOKEN}`
    }
  }).catch((err) => {
    console.error(err);
    throw new Error("Failed to give role.");
  })

  console.log(await data.text())
}