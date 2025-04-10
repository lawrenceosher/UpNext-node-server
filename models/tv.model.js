import mongoose, { Model } from 'mongoose';
import tvSchema from '../schemas/tv.schema';
import { TV } from '../types/tv';

/**
 * Mongoose model for the `TV` collection.
 *
 * This model is created using the `TV` interface and the `tvSchema`, representing the
 * `TV` collection in the MongoDB database, and provides an interface for interacting with
 * the stored TV shows.
 *
 * @type {Model<TV>}
 */
const TVModel = mongoose.model<TV>('TVModel', tvSchema);

export default TVModel;
