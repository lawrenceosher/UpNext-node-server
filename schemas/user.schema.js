import { Schema } from "mongoose";

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `_id`: The unique id of the user (not managed by MongoDB)
 * - `username`: The username of the user.
 * - `password`: The password securing the user's account.
 * - `dateJoined`: The date the user joined the platform.
 * - `email`: The email of the user.
 * - `groups`: The groups the user is part of.
 * - `groupInvites`: The invitations the user has received to join groups.
 */
const userSchema = new Schema(
  {
    _id: String,
    username: {
      type: String,
      unique: true,
    },
    password: String,
    dateJoined: Date,
    email: String,
    groups: [
      {
        type: String,
        ref: "GroupModel",
      },
    ],
    groupInvites: [
      {
        type: String,
        ref: "InvitationModel",
      },
    ],
  },
  { collection: "User" }
);

export default userSchema;
