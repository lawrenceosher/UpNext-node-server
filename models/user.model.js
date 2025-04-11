import mongoose, { Model } from 'mongoose';
import userSchema from '../schemas/user.schema';
import { User } from '../types/user';

/**
 * Mongoose model for the `User` collection.
 *
 * This model is created using the `User` interface and the `userSchema`, representing the
 * `User` collection in the MongoDB database, and provides an interface for interacting with
 * the stored users.
 *
 * @type {Model<User>}
 */
const UserModel = mongoose.model<User>('UserModel', userSchema);

export default UserModel;
