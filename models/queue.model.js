import mongoose from 'mongoose';
import queueSchema from '../schemas/queue.schema.js';

/**
 * Mongoose model for the `Queue` collection.
 *
 * This model is created using the `Queue` interface and the `queueSchema`, representing the
 * `Queue` collection in the MongoDB database, and provides an interface for interacting with
 * the stored queues.
 *
 */
const QueueModel = mongoose.model('QueueModel', queueSchema);

export default QueueModel;
