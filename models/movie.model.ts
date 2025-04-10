import mongoose, { Model } from 'mongoose';
import movieSchema from '../schemas/movie.schema'
import { Movie } from '../types/movie.d';

/**
 * Mongoose model for the `Movie` collection.
 *
 * This model is created using the `Movie` interface and the `movieSchema`, representing the
 * `Movie` collection in the MongoDB database, and provides an interface for interacting with
 * the stored movies.
 *
 * @type {Model<Movie>}
 */
const MovieModel: Model<Movie> = mongoose.model<Movie>('Movie', movieSchema);

export default MovieModel;
