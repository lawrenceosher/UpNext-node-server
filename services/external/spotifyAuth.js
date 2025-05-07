import axios from "axios";

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetches a Spotify access token using client credentials.
 * The token is cached and reused until it expires.
 *
 * @returns The Spotify access token.
 */
export async function getSpotifyToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  // Set the request body with the grant type
  // and the client credentials
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    params,
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  // Store the token and its expiry time
  cachedToken = response.data.access_token;
  tokenExpiry = Date.now() + response.data.expires_in * 1000;
  return cachedToken;
}
