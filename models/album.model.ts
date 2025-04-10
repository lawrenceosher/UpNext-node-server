import mongoose, { Model } from 'mongoose';
import albumSchema from '../schemas/album.schema';
import { Album } from '../types/album.d';

/**
 * Mongoose model for the `Album` collection.
 *
 * This model is created using the `Album` interface and the `albumSchema`, representing the
 * `Album` collection in the MongoDB database, and provides an interface for interacting with
 * the stored albums.
 *
 * @type {Model<Album>}
 */
const AlbumModel: Model<Album> = mongoose.model<Album>('Album', albumSchema);

export default AlbumModel;
