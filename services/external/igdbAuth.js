import axios from "axios";

const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetches an access token from the IGDB API using client credentials.
 * The token is cached and will be refreshed 1 minute before it expires.
 * @returns The access token.
 */
export async function getIGDBAccessToken() {
  const now = Date.now();

  // Return cached token if it exists and is not expired
  if (cachedToken && tokenExpiry > now) {
    return cachedToken;
  }

  // If the token is expired or doesn't exist, fetch a new one
  const res = await axios.post(
    `${TOKEN_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
  );

  const { access_token, expires_in } = res.data;

  // Set the cached token and its expiry time
  cachedToken = access_token;
  tokenExpiry = now + expires_in * 1000 - 60 * 1000; // refresh 1 min early

  return cachedToken;
}
