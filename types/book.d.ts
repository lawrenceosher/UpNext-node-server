// Normalized Book type with data aggregated from ISBN Database API
export interface Book {
  _id: string;
  title: string;
  authors: string[];
  synopsis: string;
  publisher: string;
  coverArt: string;
  datePublished: string;
  pages: number;
  sourceUrl: string;
}

// Response from UpNext API
export type BookResponse = Book | { error: string };
