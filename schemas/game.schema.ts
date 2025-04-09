import { Schema } from "mongoose";

/**
 * Mongoose schema for the Game collection.
 *
 * This schema defines the structure for storing games in the database.
 * Games will be normalized from calls to external APIs and stored in the database.
 * Each Game includes the following fields:
 * - `_id`: The unique id of the game (not managed by MongoDB)
 * - `title`: The title of the game.
 * - `summary`: A brief summary of the game.
 * - `releaseDate`: The release date of the game.
 * - `coverArt`: The path to the game's cover art image.
 * - `genres`: An array of genres associated with the game.
 * - `companies`: An array of companies associated with the game.
 * - `platforms`: An array of platforms on which the game is available.
 * - `sourceUrl`: The URL of the source from which the game was fetched.
 */
const gameSchema: Schema = new Schema(
  {
    _id: String,
    title: String,
    summary: String,
    releaseDate: String,
    coverArt: String,
    genres: [{ type: String }],
    companies: [{ type: String }],
    platforms: [{ type: String }],
    sourceUrl: String,
  },
  { collection: "Game" }
);

export default gameSchema;
