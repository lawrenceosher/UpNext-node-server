import mongoose, { Model } from 'mongoose';
import queueSchema from '../schemas/queue.schema';
import { Queue } from '../types/queue';

/**
 * Mongoose model for the `Queue` collection.
 *
 * This model is created using the `Queue` interface and the `queueSchema`, representing the
 * `Queue` collection in the MongoDB database, and provides an interface for interacting with
 * the stored queues.
 *
 * @type {Model<Queue>}
 */
const QueueModel = mongoose.model<Queue>('QueueModel', queueSchema);

export default QueueModel;
