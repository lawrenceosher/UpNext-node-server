// Normalized TV type with data aggregated from TMDB (The Movie Database) API
export interface TV {
  _id: string;
  title: string;
  posterPath: string;
  description: string;
  firstAirDate: string;
  lastAirDate?: string;
  genres: string[];
  cast: string[];
  creator: string;
  totalEpisodes: number;
  totalSeasons: number;
  sourceUrl: string;
}

// Response from UpNext API
export type TVShowResponse = TV | { error: string };
