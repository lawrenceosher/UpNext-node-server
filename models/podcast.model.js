import mongoose, { Model } from 'mongoose';
import podcastSchema from '../schemas/podcast.schema';
import { Podcast } from '../types/podcast';

/**
 * Mongoose model for the `Podcast` collection.
 *
 * This model is created using the `Podcast` interface and the `podcastSchema`, representing the
 * `Podcast` collection in the MongoDB database, and provides an interface for interacting with
 * the stored podcasts.
 *
 * @type {Model<Podcast>}
 */
const PodcastModel = mongoose.model<Podcast>('PodcastModel', podcastSchema);

export default PodcastModel;
