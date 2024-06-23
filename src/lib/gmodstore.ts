import {error} from "@sveltejs/kit";
import {env as env} from "$env/dynamic/private";
import {ids} from "$lib/discord";

export async function getGmodstorePurchases(gmodstoreId: string) {
  let filterString = "";

  const idsArray = Object.keys(ids);

  for (let i = 0; i < idsArray.length; i++) {
    filterString += idsArray[i];
    if (i !== idsArray.length - 1) {
      filterString += ",";
    }
  }

  const response = await fetch(
    `https://www.gmodstore.com/api/v3/users/${gmodstoreId}/purchases?filter[productId]=${filterString}`,
    {
      headers: {
        "Authorization": `Bearer ${env.GMODSTORE_TOKEN}`,
      },
    },
  ).catch((e) => {
    console.error(e);
    throw error(500, "Failed to get user purchase data.");
  });

  const data = await response.json();
  console.log("Got gmodstore purchases")
  console.log(data?.data)

  return data?.data;
}
