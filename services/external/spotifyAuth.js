import axios from "axios";
import Redis from "ioredis";

// Memory cache as additional fallback
let memoryCache = {
  token: null,
  expiresAt: null,
};

// Initialize Redis client with timeout and retry options
const redisClient = new Redis(process.env.REDIS_URL, {
  connectTimeout: 5000,
  retryStrategy: (times) => {
    if (times > 3) return null; // Stop retrying after 3 attempts
    return Math.min(times * 200, 1000); // Exponential backoff
  },
});

// Add error handling
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

const REDIS_KEY = "spotify_token";

/**
 * Requests a new access token from Spotify API using client credentials flow.
 */
async function requestSpotifyToken() {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

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

    return {
      token: response.data.access_token,
      expiresIn: response.data.expires_in,
    };
  } catch (error) {
    console.error("Failed to request Spotify token:", error.message);
    throw error;
  }
}

/**
 * Retrieves a Spotify token with multiple fallback mechanisms.
 */
export async function getSpotifyToken() {
  // First check memory cache
  const now = Date.now();
  if (memoryCache.token && memoryCache.expiresAt > now) {
    console.log("Using token from memory cache");
    return memoryCache.token;
  }

  try {
    // Try to get token from Redis
    const cachedToken = await Promise.race([
      redisClient.get(REDIS_KEY),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Redis get timeout")), 3000)
      ),
    ]);

    if (cachedToken) {
      const parsed = JSON.parse(cachedToken);

      // Check if the token from Redis is still valid
      if (parsed.expiresAt && new Date(parsed.expiresAt) > new Date()) {
        // Token is still valid, update memory cache
        memoryCache = {
          token: parsed.token,
          expiresAt: new Date(parsed.expiresAt).getTime(),
        };
        return parsed.token;
      } else {
        console.log("Token from Redis is expired, requesting new one");
      }
    }

    // If we get here, no valid token in Redis - get a new one
    const newToken = await requestSpotifyToken();

    // Calculate actual expiry timestamp (as ISO string for better serialization)
    const expiresAt = new Date(
      Date.now() + newToken.expiresIn * 1000 - 60000
    ).toISOString();

    // Update memory cache
    memoryCache = {
      token: newToken.token,
      expiresAt: new Date(expiresAt).getTime(),
    };

    // Store token with the expiry timestamp in Redis
    redisClient
      .set(
        REDIS_KEY,
        JSON.stringify({
          token: newToken.token,
          expiresAt: expiresAt,
        }),
        "EX",
        newToken.expiresIn
      )
      .catch((err) =>
        console.error("Failed to store token in Redis:", err.message)
      );

    return newToken.token;
  } catch (error) {
    console.error(
      "Redis operation failed, falling back to direct API call:",
      error.message
    );

    // If Redis fails completely, get a fresh token from Spotify
    try {
      const newToken = await requestSpotifyToken();

      // Still update memory cache
      memoryCache = {
        token: newToken.token,
        expiresAt: now + newToken.expiresIn * 1000 - 60000,
      };

      return newToken.token;
    } catch (spotifyError) {
      console.error("Spotify API call failed:", spotifyError.message);
      throw spotifyError; // No more fallbacks, propagate the error
    }
  }
}
