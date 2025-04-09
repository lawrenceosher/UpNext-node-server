import { Schema } from "mongoose";

/**
 * Mongoose schema for the User collection.
 *
 * This schema defines the structure for storing users in the database.
 * Each User includes the following fields:
 * - `_id`: The unique id of the user (not managed by MongoDB)
 * - `username`: The username of the user.
 * - `password`: The password securing the user's account.
 * - `firstName`: The first name of the user.
 * - `lastName`: The last name of the user.
 * - `dateJoined`: The date the user joined the platform.
 * - `email`: The email of the user.
 * - `role`: The role of the user that is either a regular 'USER' or 'ADMIN' with elevated privileges.
 * - `followers`: The other users that follow this user.
 * - `following`: The other users that this user follows.
 */
const userSchema: Schema = new Schema(
  {
    _id: String,
    username: {
      type: String,
      unique: true,
    },
    password: String,
    firstName: String,
    lastName: String,
    dateJoined: Date,
    email: String,
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    followers: [
      {
        type: String,
        ref: "User",
      },
    ],
    following: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { collection: "User" }
);

export default userSchema;
