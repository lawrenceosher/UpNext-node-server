import mongoose, { Model } from 'mongoose';
import movieSchema from '../schemas/movie.schema'
import { Movie } from '../types/movie';

/**
 * Mongoose model for the `Movie` collection.
 *
 * This model is created using the `Movie` interface and the `movieSchema`, representing the
 * `Movie` collection in the MongoDB database, and provides an interface for interacting with
 * the stored movies.
 *
 * @type {Model<Movie>}
 */
const MovieModel = mongoose.model<Movie>('MovieModel', movieSchema);

export default MovieModel;
