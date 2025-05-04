import mongoose from 'mongoose';
import movieSchema from '../schemas/movie.schema.js'

/**
 * Mongoose model for the `Movie` collection.
 *
 * This model is created using the `Movie` interface and the `movieSchema`, representing the
 * `Movie` collection in the MongoDB database, and provides an interface for interacting with
 * the stored movies.
 *
 */
const MovieModel = mongoose.model('MovieModel', movieSchema);

export default MovieModel;
