import axios from "axios";
import { getSpotifyToken } from "./spotifyAuth.js";

const SPOTIFY_BASE = "https://api.spotify.com/v1";
const accessToken = await getSpotifyToken();

/**
 * Normalizes the album details object from Spotify API in accordance with the Album schema.
 * @param albumDetails - The album details object from Spotify API.
 * @returns A normalized album object.
 */
const normalizeAlbum = (albumDetails) => {
  return {
    _id: albumDetails.id,
    title: albumDetails.name,
    artist: albumDetails.artists.map((a) => a.name).join(", "),
    label: albumDetails.label,
    coverArt: albumDetails.images?.[0]?.url || "",
    releaseDate: albumDetails.release_date,
    tracks: albumDetails.tracks.items.map((track) => track.name),
    sourceUrl: albumDetails.external_urls.spotify,
  };
};

/**
 * Normalizes the podcast details object from Spotify API in accordance with the Podcast schema.
 * @param podcastDetails - The podcast details object from Spotify API.
 * @param episodes - The list of episodes for the podcast.
 * @returns A normalized podcast object.
 */
const normalizePodcast = (podcastDetails, episodes) => {
  return {
    _id: podcastDetails.id,
    title: podcastDetails.name,
    description: podcastDetails.description,
    coverArt: podcastDetails.images?.[0]?.url || "",
    publisher: podcastDetails.publisher,
    latestEpisodeDate: episodes[0]?.release_date || "",
    episodes: episodes.map((ep) => ep?.name || "Unknown Episode"),
    sourceUrl: podcastDetails.external_urls.spotify,
  };
};

/**
 * Searches for albums on Spotify based on a query string.
 * @param query - The search query string.
 * @returns A promise that resolves to an array of album objects.
 */
export async function searchSpotifyAlbums(query) {
  // Encode the query string in the endpoint URL
  const searchUrl = `${SPOTIFY_BASE}/search?q=${encodeURIComponent(
    query
  )}&type=album`;

  // Make a GET request to the Spotify API
  // to search for albums matching the query
  const searchRes = await axios.get(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Extract the album items from the response
  const albums = searchRes.data.albums.items;

  const detailedAlbums = await Promise.all(
    albums.map(async (album) => {
      // For each album, make a GET request to fetch its details
      return await getAlbumDetailsFromSpotify(album.id);
    })
  );

  return detailedAlbums;
}

/**
 * Fetches detailed information about a specific album from Spotify
 * @param albumId - The Spotify album ID.
 * @returns A promise that resolves to a normalized album object.
 */
export async function getAlbumDetailsFromSpotify(albumId) {
  const detailRes = await axios.get(`${SPOTIFY_BASE}/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const albumDetails = detailRes.data;

  return normalizeAlbum(albumDetails);
}

/**
 * Searches for podcasts on Spotify based on a query string.
 * @param query - The search query string.
 * @returns A promise that resolves to an array of podcast objects.
 */
export async function searchSpotifyPodcasts(query) {
  // Encode the query string in the endpoint URL
  const searchUrl = `${SPOTIFY_BASE}/search?q=${encodeURIComponent(
    query
  )}&type=show&limit=10`;

  // Make a GET request to the Spotify API
  // to search for podcasts matching the query
  const searchRes = await axios.get(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  // Extract the podcast items from the response
  const shows = searchRes.data.shows.items;

  const detailedPodcasts = await Promise.all(
    shows.map(async (show) => {
      // For each podcast, make a GET request to fetch its details
      return await getPodcastDetailsFromSpotify(show.id);
    })
  );

  return detailedPodcasts;
}

/**
 * Fetches detailed information about a specific podcast from Spotify
 * @param podcastId - The Spotify podcast ID.
 * @returns A promise that resolves to a normalized podcast object.
 */
export async function getPodcastDetailsFromSpotify(podcastId) {
  try {
    // Make a GET request to fetch its details
    const detailRes = await axios.get(
      `${SPOTIFY_BASE}/shows/${podcastId}?market=US`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const details = detailRes.data;

    // Make a GET request to fetch its episodes
    // and limit the number of episodes to 10
    const episodesRes = await axios.get(
      `${SPOTIFY_BASE}/shows/${podcastId}/episodes?limit=10&market=US`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Extract the episodes from the response
    const episodes = episodesRes.data?.items || [];

    return normalizePodcast(details, episodes);
  } catch (error) {
    return {
      error: `Error fetching podcast ${podcastId}: ${error.message} `,
    };
  }
}
