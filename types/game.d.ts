// Normalized VideoGame type with data aggregated from the IGDB API
export interface VideoGame {
  _id: string;
  title: string;
  summary: string;
  releaseDate: string;
  coverArt: string;
  genres: string[];
  companies: string[];
  platforms: string[];
  sourceUrl: string;
}

// Response from UpNext API
export type VideoGameResponse = VideoGame | { error: string };
