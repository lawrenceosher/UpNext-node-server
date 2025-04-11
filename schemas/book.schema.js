import { Schema } from "mongoose";

/**
 * Mongoose schema for the Book collection.
 *
 * This schema defines the structure for storing books in the database.
 * Books will be normalized from calls to external APIs and stored in the database.
 * Each Book includes the following fields:
 * - `_id`: The unique id of the book (not managed by MongoDB)
 * - `title`: The title of the book.
 * - `authors`: An array of authors of the book.
 * - `synopsis`: A brief synopsis of the book.
 * - `publisher`: The publisher of the book.
 * - `coverArt`: The path to the book's cover art image.
 * - `datePublished`: The date the book was published.
 * - `pages`: The number of pages in the book.
 * - `sourceUrl`: The URL of the source from which the book was fetched.
 */
const bookSchema = new Schema(
  {
    _id: String,
    title: String,
    authors: [{ type: String }],
    synopsis: String,
    publisher: String,
    coverArt: String,
    datePublished: String,
    pages: Number,
    sourceUrl: String,
  },
  { collection: "Book" }
);

export default bookSchema;
