import mongoose, { Model } from 'mongoose';
import groupSchema from '../schemas/group.schema';
import { Group } from '../types/group';

/**
 * Mongoose model for the `Group` collection.
 *
 * This model is created using the `Group` interface and the `groupSchema`, representing the
 * `Group` collection in the MongoDB database, and provides an interface for interacting with
 * the stored groups.
 *
 * @type {Model<Group>}
 */
const GroupModel: Model<Group> = mongoose.model<Group>('Group', groupSchema);

export default GroupModel;
