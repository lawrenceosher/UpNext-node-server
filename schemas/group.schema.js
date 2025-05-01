import { Schema } from "mongoose";

/**
 * Mongoose schema for the Group collection.
 *
 * The purpose of groups is for multiple users to join and create shared queues
 * This schema defines the structure for storing groups in the database.
 * Each Group includes the following fields:
 * - `_id`: The unique id of the group (not managed by MongoDB)
 * - `name`: The name of the group
 * - `creator`: The user who created the group
 * - `members`: The members part of the group
 */
const groupSchema = new Schema(
  {
    _id: String,
    name: String,
    creator: String,
    members: [
      {
        type: String,
      },
    ],
  },
  { collection: "Group" }
);

export default groupSchema;
