import { Schema } from "mongoose";

/**
 * Mongoose schema for the Podcast collection.
 *
 * This schema defines the structure for storing podcasts in the database.
 * Podcasts will be normalized from calls to external APIs and stored in the database.
 * Each Podcast includes the following fields:
 * - `_id`: The unique id of the podcast (not managed by MongoDB)
 * - `title`: The title of the podcast.
 * - `description`: A brief description of the podcast.
 * - `coverArt`: The path to the podcast's cover art image.
 * - `publisher`: The publisher of the podcast.
 * - `latestEpisodeDate`: The date of the latest episode.
 * - `episodes`: An array of episode titles associated with the podcast.
 * - `sourceUrl`: The URL of the source from which the podcast was fetched.
 */
const podcastSchema = new Schema(
  {
    _id: String,
    title: String,
    description: String,
    coverArt: String,
    publisher: String,
    latestEpisodeDate: String,
    episodes: [{ type: String }],
    sourceUrl: String,
  },
  { collection: "Podcast" }
);

export default podcastSchema;
