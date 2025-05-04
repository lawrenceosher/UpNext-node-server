import mongoose from 'mongoose';
import videoGameSchema from '../schemas/game.schema.js';

/**
 * Mongoose model for the `Video Game` collection.
 *
 * This model is created using the `Video Game` interface and the `videoGameSchema`, representing the
 * `Video Game` collection in the MongoDB database, and provides an interface for interacting with
 * the stored video games.
 *
 */
const VideoGameModel = mongoose.model('VideoGameModel', videoGameSchema);

export default VideoGameModel;
