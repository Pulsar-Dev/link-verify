import {json} from "@sveltejs/kit";
import {verifyToken} from "$lib/tokens";
import {BACKEND_API_KEY, BACKEND_URL, GMODSTORE_TOKEN} from "$env/static/private";

async function getGmodstoreID(steamId: string) {
  const data = await fetch(`https://www.gmodstore.com/api/v3/users?filter[steamId]=${steamId}`, {
    headers: {
      Authorization: `Bearer ${GMODSTORE_TOKEN}`,

    }
  }).then(res => res.json());

  return data?.data?.[0]?.id;
}

export async function POST(event) {
  const token = event.request.headers.get("token");

  if (!token) {
    return json({
      success: false,
      error: "No token provided."
    });
  }

  const [validToken, invalidReason] = verifyToken(token);

  if (!validToken) {
    return json({
      success: false,
      error: invalidReason
    });
  }

  const body = await event.request.json();

  if (!body || !body?.steamId || !body?.discordId) {
    return json({
      success: false,
      error: "No body provided."
    });
  }

  const gmodstoreId = await getGmodstoreID(body.steamId);

  const data = await fetch(`${BACKEND_URL}/user?steam_id=${body.steamId}&discord_id=${body.discordId}&gmodstore_id=${gmodstoreId}`, {
    method: "POST",
    headers: {
      "Authorization": BACKEND_API_KEY,
    }
  }).then(res => res.json());

  if (!data || data.error) {
    return json({
      success: false,
      error: data.error
    });
  }

  return json({
    success: true
  });
}