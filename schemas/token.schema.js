import { Schema } from "mongoose";

/**
 * Mongoose schema for the Token collection.
 *
 * This schema defines the structure for storing tokens in the database.
 * Tokens are used to authenticate with external APIs and are stored in the database.
 * Each token includes the following fields:
 * - `provider`: The name of the provider (e.g., "spotify").
 * - `token`: The actual token string.
 * - `expiry`: The expiration time of the token in Unix timestamp format (in milliseconds).
 */
const tokenSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiry: {
      type: Number,
      required: true,
    },
  },
  { collection: "Token" }
);

export default tokenSchema;
