import axios from "axios";
import { getIGDBAccessToken } from "./igdbAuth.js";

const IGDB_BASE = "https://api.igdb.com/v4/games";
const accessToken = await getIGDBAccessToken();
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;

export async function searchIGDBGames(query) {
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

  const normalizedGames = games.map((game) => ({
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
  }));

  return normalizedGames;
}

export async function fetchGameById(gameId) {
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
  if (!game) return null;

  const videoGame = {
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

  return videoGame;
}
