import axios from "axios";
import { getSpotifyToken } from "./spotifyAuth.js";

const SPOTIFY_BASE = "https://api.spotify.com/v1";
const accessToken = await getSpotifyToken();

export async function searchSpotifyAlbums(query) {
  const searchUrl = `${SPOTIFY_BASE}/search?q=${encodeURIComponent(
    query
  )}&type=album`;
  const searchRes = await axios.get(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const albums = searchRes.data.albums.items;

  const detailedAlbums = await Promise.all(
    albums.map(async (album) => {
      const detailRes = await axios.get(`${SPOTIFY_BASE}/albums/${album.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const details = detailRes.data;

      return {
        _id: details.id,
        title: details.name,
        artist: details.artists.map((a) => a.name).join(", "),
        label: details.label,
        coverArt: details.images?.[0]?.url || "",
        releaseDate: details.release_date,
        tracks: details.tracks.items.map((track) => track.name),
        sourceUrl: details.external_urls.spotify,
      };
    })
  );

  return detailedAlbums;
}

export async function getAlbumDetailsFromSpotify(albumId) {
  const detailRes = await axios.get(`${SPOTIFY_BASE}/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const details = detailRes.data;

  return {
    _id: details.id,
    title: details.name,
    artist: details.artists.map((a) => a.name).join(", "),
    label: details.label,
    coverArt: details.images?.[0]?.url || "",
    releaseDate: details.release_date,
    tracks: details.tracks.items.map((track) => track.name),
    sourceUrl: details.external_urls.spotify,
  };
}

export async function searchSpotifyPodcasts(query) {
  const searchUrl = `${SPOTIFY_BASE}/search?q=${encodeURIComponent(
    query
  )}&type=show&limit=10`;
  const searchRes = await axios.get(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const shows = searchRes.data.shows.items;

  const detailedPodcasts = await Promise.all(
    shows.map(async (show) => {
      try {
        const detailRes = await axios.get(
          `${SPOTIFY_BASE}/shows/${show.id}?market=US`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const details = detailRes.data;

        const episodesRes = await axios.get(
          `https://api.spotify.com/v1/shows/${show.id}/episodes?limit=10&market=US`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const episodes = episodesRes.data?.items || [];

        return {
          _id: details.id,
          title: details.name,
          description: details.description,
          coverArt: details.images?.[0]?.url || "",
          publisher: details.publisher,
          latestEpisodeDate: episodes[0]?.release_date || "",
          episodes: episodes.map((ep) => ep?.name || "Unknown Episode"),
          sourceUrl: details.external_urls.spotify,
        };
      } catch (err) {
        console.error(`Error fetching podcast ${show.id}:`, err.message);
        return null;
      }
    })
  );

  // filter out any nulls caused by failed fetches
  return detailedPodcasts.filter(Boolean);
}

export async function getPodcastDetailsFromSpotify(podcastId) {
  try {
    const detailRes = await axios.get(
      `${SPOTIFY_BASE}/shows/${podcastId}?market=US`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const details = detailRes.data;

    const episodesRes = await axios.get(
      `https://api.spotify.com/v1/shows/${podcastId}/episodes?limit=10&market=US`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const episodes = episodesRes.data?.items || [];

    return {
      _id: details.id,
      title: details.name,
      description: details.description,
      coverArt: details.images?.[0]?.url || "",
      publisher: details.publisher,
      latestEpisodeDate: episodes[0]?.release_date || "",
      episodes: episodes.map((ep) => ep?.name || "Unknown Episode"),
      sourceUrl: details.external_urls.spotify,
    };
  } catch (err) {
    console.error(`Error fetching podcast ${podcastId}:`, err.message);
    return null;
  }
}
