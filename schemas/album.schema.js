import { Schema } from "mongoose";

/** 
 * Mongoose schema for the Album collection.
 * 
 * This schema defines the structure for storing albums in the database.
 * Albums will be normalized from calls to external APIs and stored in the database.
 * Each Album includes the following fields:
 * - `_id`: The unique id of the album (not managed by MongoDB)
 * - `title`: The title of the album.
 * - `artist`: The artist of the album.
 * - `label`: The label of the album.
 * - `coverArt`: The path to the album's cover art image.
 * - `releaseDate`: The release date of the album.
 * - `tracks`: An array of track names associated with the album.
 * - `sourceUrl`: The URL of the source from which the album was fetched.
 */
const albumSchema = new Schema(
  {
    _id: String,
    title: String,
    artist: String,
    label: String,
    coverArt: String,
    releaseDate: String,
    tracks: [{ type: String }],
    sourceUrl: String,
  },
  { collection: "Album" }
);

export default albumSchema;
