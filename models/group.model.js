import mongoose, { Model } from 'mongoose';
import groupSchema from '../schemas/group.schema.js';

/**
 * Mongoose model for the `Group` collection.
 *
 * This model is created using the `Group` interface and the `groupSchema`, representing the
 * `Group` collection in the MongoDB database, and provides an interface for interacting with
 * the stored groups.
 *
 */
const GroupModel = mongoose.model('GroupModel', groupSchema);

export default GroupModel;
