import { Schema } from "mongoose";

/**
 * Mongoose schema for the Queue collection.
 *
 * The purpose of queues is for users to add media that they want to consume later
 * This schema defines the structure for storing queues in the database.
 * Each Queue includes the following fields:
 * - `_id`: The unique id of the queue (not managed by MongoDB)
 * - `mediaType`: The type of media that this queue represents. One of 'Movie', 'TV', 'Album', 'Book', 'Game', 'Podcast'
 * - `user`: The user this queue belongs to. Can be null if is a group queue
 * - `group`: The group this queue belongs to. Can be null if is a personal queue
 * - `current`: The media that is yet to be consumed. This is an array of media ids
 * - `history`: The media that has been consumed in the past. This is an array of media ids
 */
const queueSchema: Schema = new Schema(
  {
    _id: String,
    mediaType: {
      type: String,
      enum: ["Movie", "TV", "Album", "Book", "Game", "Podcast"],
    },
    user: {
      type: String,
      ref: "User",
    },
    group: {
      type: String,
      ref: "Group",
    },
    current: [
      {
        type: String,
        refPath: "Media",
      },
    ],
    history: [
      {
        type: String,
        refPath: "Media",
      },
    ],
    media: {
      type: String,
      enum: ["Movie", "TV", "Album", "Book", "Game", "Podcast"],
      required: true,
    },
  },
  { collection: "Queue" }
);

export default queueSchema;
