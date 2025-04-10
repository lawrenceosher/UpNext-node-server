// Normalized Podcast type with data aggregated from the Spotify API
export interface Podcast {
  _id: string;
  title: string;
  description: string;
  coverArt: string;
  publisher: string;
  latestEpisodeDate: string;
  episodes: string[];
  sourceUrl: string;
}

// Response from UpNext API
export type PodcastResponse = Podcast | { error: string };
