import { Schema } from "mongoose";

/**
 * Mongoose schema for the Group collection.
 *
 * The purpose of groups is for multiple users to join and create shared queues
 * This schema defines the structure for storing groups in the database.
 * Each Group includes the following fields:
 * - `_id`: The unique id of the group (not managed by MongoDB)
 * - `groupName`: The name of the group
 * - `users`: The users part of the group
 */
const groupSchema: Schema = new Schema(
  {
    _id: String,
    groupName: String,
    users: [
      {
        type: String,
        ref: "UserModel",
      },
    ],
  },
  { collection: "Group" }
);

export default groupSchema;
