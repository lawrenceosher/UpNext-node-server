import mongoose, { Model } from 'mongoose';
import podcastSchema from '../schemas/podcast.schema';
import { Podcast } from '../types/podcast.d';

/**
 * Mongoose model for the `Podcast` collection.
 *
 * This model is created using the `Podcast` interface and the `podcastSchema`, representing the
 * `Podcast` collection in the MongoDB database, and provides an interface for interacting with
 * the stored podcasts.
 *
 * @type {Model<Podcast>}
 */
const PodcastModel: Model<Podcast> = mongoose.model<Podcast>('Podcast', podcastSchema);

export default PodcastModel;
