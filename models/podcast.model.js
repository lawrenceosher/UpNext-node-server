import mongoose, { Model } from 'mongoose';
import podcastSchema from '../schemas/podcast.schema.js';

/**
 * Mongoose model for the `Podcast` collection.
 *
 * This model is created using the `Podcast` interface and the `podcastSchema`, representing the
 * `Podcast` collection in the MongoDB database, and provides an interface for interacting with
 * the stored podcasts.
 * 
 */
const PodcastModel = mongoose.model('PodcastModel', podcastSchema);

export default PodcastModel;
