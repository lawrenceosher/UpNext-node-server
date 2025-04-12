import mongoose, { Model } from 'mongoose';
import tvSchema from '../schemas/tv.schema.js';

/**
 * Mongoose model for the `TV` collection.
 *
 * This model is created using the `TV` interface and the `tvSchema`, representing the
 * `TV` collection in the MongoDB database, and provides an interface for interacting with
 * the stored TV shows.
 *
 */
const TVModel = mongoose.model('TVModel', tvSchema);

export default TVModel;
