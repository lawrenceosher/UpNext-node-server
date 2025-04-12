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
