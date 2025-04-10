// Normalized Movie type with data aggregated from TMDB (The Movie Database) API
export interface Movie {
  _id: string;
  title: string;
  director: string;
  description: string;
  releaseDate: string;
  posterPath: string;
  cast: string[];
  genres: string[];
  sourceUrl: string;
}

// Response from UpNext API
export type MovieResponse = Movie | { error: string };
