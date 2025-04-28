import { Schema } from "mongoose";

/**
 * Mongoose schema for the Invitation collection.
 *
 * The purpose of invitations is for users to invite others to join groups
 * This schema defines the structure for storing invitations in the database.
 * Each Invitation includes the following fields:
 * - `_id`: The unique id of the invitation (not managed by MongoDB)
 * - `group`: The group to which the user is invited
 * - `invitedBy`: The user who sent the invitation
 * - `invitedUser`: The user who is invited
 * - `status`: The status of the invitation (pending, accepted, declined)
 */
const invitationSchema = new Schema(
  {
    _id: String,
    group: {
      type: String,
      ref: "GroupModel",
    },
    invitedBy: String,
    invitedUser: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { collection: "Invitation" },
  {
    timestamps: true,
  }
);

export default invitationSchema;
