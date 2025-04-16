import { Schema } from "mongoose";

/**
 * Mongoose schema for the Movie collection.
 *
 * This schema defines the structure for storing movies in the database.
 * Movies will be normalized from calls to external APIs and stored in the database.
 * Each Movie includes the following fields:
 * - `_id`: The unique id of the movie (not managed by MongoDB)
 * - `title`: The title of the movie.
 * - `director`: The director of the movie.
 * - `description`: A brief description of the movie.
 * - `releaseDate`: The release date of the movie.
 * - `posterPath`: The path to the movie's poster image.
 * - `cast`: An array of cast members in the movie.
 * - `genres`: An array of genres associated with the movie.
 * - `sourceUrl`: The URL of the source from which the movie was fetched.
 */
const movieSchema = new Schema(
  {
    _id: String,
    title: String,
    director: String,
    description: String,
    releaseDate: String,
    posterPath: String,
    cast: [{ type: String }],
    genres: [{ type: String }],
    runtime: Number,
    sourceUrl: String,
    numQueues: { type: Number, default: 0 },
  },
  { collection: "Movie" },
);

export default movieSchema;
