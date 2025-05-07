import mongoose from 'mongoose';
import userSchema from '../schemas/user.schema.js';

/**
 * Mongoose model for the `User` collection.
 *
 * This model is created using the `User` interface and the `userSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 */
const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;
