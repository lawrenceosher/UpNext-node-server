import mongoose, { Model } from 'mongoose';
import videoGameSchema from '../schemas/game.schema';
import { VideoGame } from '../types/game.d';

/**
 * Mongoose model for the `Video Game` collection.
 *
 * This model is created using the `Video Game` interface and the `videoGameSchema`, representing the
 * `Video Game` collection in the MongoDB database, and provides an interface for interacting with
 * the stored video games.
 *
 * @type {Model<VideoGame>}
 */
const VideoGameModel: Model<VideoGame> = mongoose.model<VideoGame>('VideoGameModel', videoGameSchema);

export default VideoGameModel;
