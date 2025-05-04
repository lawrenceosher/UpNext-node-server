import axios from "axios";
import { getIGDBAccessToken } from "./igdbAuth.js";

const IGDB_BASE = "https://api.igdb.com/v4/games";
const accessToken = await getIGDBAccessToken();
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

/**
 * Normalizes the game object to a consistent format in accordance with Video Game schema.
 * @param game - The game object from the API response.
 * @returns The normalized game object.
 */
const normalizeGame = (game) => {
  return {
    _id: game.id.toString(),
    title: game.name,
    summary: game.summary || "No summary available.",
    releaseDate: game.first_release_date
      ? new Date(game.first_release_date * 1000).toISOString().split("T")[0]
      : "",
    coverArt: game.cover?.image_id
      ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
      : "",
    genres: game.genres?.map((g) => g.name) || [],
    companies: game.involved_companies?.map((c) => c.company.name) || [],
    platforms: game.platforms?.map((p) => p.name) || [],
    sourceUrl:
      game.url ||
      `https://www.igdb.com/games/${
        game.slug || game.name.toLowerCase().replace(/\s+/g, "-")
      }`,
  };
};

/**
 * Fetches games from IGDB API based on a search query.
 * @param query - The search query string.
 * @returns A promise that resolves to an array of normalized game objects.
 */
export async function searchIGDBGames(query) {
  try {
    // Encode the query in the endpoint and ensure the headers are set
    // to include the access token and client ID and limit the number of results to 10
    const res = await axios.post(
      IGDB_BASE,
      `
    search "${query}";
    fields name,summary,first_release_date,cover.image_id,genres.name,involved_companies.company.name,platforms.name,url;
    limit 10;
  `,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const games = res.data;

    const normalizedGames = games.map((game) => normalizeGame(game));

    return normalizedGames;
  } catch (error) {
    return {
      error: `Error fetching games: ${error.message}`,
    };
  }
}

/**
 * Fetches a game from IGDB API by its ID.
 * @param gameId - The ID of the game to fetch.
 * @returns A promise that resolves to a normalized game object.
 */
export async function fetchGameById(gameId) {
  try {
    // Encode the game ID in the endpoint URL and ensure the headers are set
    // to include the access token and client ID
    const res = await axios.post(
      IGDB_BASE,
      `
      where id = ${gameId};
      fields name,summary,first_release_date,cover.image_id,genres.name,involved_companies.company.name,platforms.name,url,slug;
      limit 1;
      `,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const game = res.data?.[0];

    // If no game is found, throw an error
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }

    return normalizeGame(game);
  } catch (error) {
    return {
      error: `Error fetching game: ${error.message}`,
    };
  }
}
