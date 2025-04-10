// Normalized Album type with data aggregated from the Spotify API
export interface Album {
  _id: string;
  title: string;
  artist: string;
  label: string;
  coverArt: string;
  releaseDate: string;
  tracks: string[];
  sourceUrl: string;
}

// Response from UpNext API
export type AlbumResponse = Album | { error: string };
