import { Schema } from "mongoose";

/**
 * Mongoose schema for the TV collection.
 *
 * This schema defines the structure for storing TV shows in the database.
 * TV shows will be normalized from calls to external APIs and stored in the database.
 * Each TV show includes the following fields:
 * - `_id`: The unique id of the TV show (not managed by MongoDB)
 * - `title`: The title of the TV show.
 * - `posterPath`: The path to the show's poster image.
 * - `description`: A brief description of the show.
 * - `firstAirDate`: The release date of the show.
 * - `lastAirDate`: The last date the show aired.
 * - `cast`: An array of cast members in the show.
 * - `genres`: An array of genres associated with the show.
 * - `creator`: The creator of the show.
 * - `totalEpisodes`: The total number of episodes in the show.
 * - `totalSeasons`: The total number of seasons in the show.
 * - `sourceUrl`: The URL of the source from which the show was fetched.
 */
const tvSchema = new Schema(
  {
    _id: String,
    title: String,
    posterPath: String,
    description: String,
    firstAirDate: String,
    lastAirDate: String,
    cast: [{ type: String }],
    genres: [{ type: String }],
    creator: String,
    totalEpisodes: Number,
    totalSeasons: Number,
    sourceUrl: String,
  },
  { collection: "TV" }
);

export default tvSchema;
