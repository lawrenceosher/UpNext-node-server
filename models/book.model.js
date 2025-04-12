import mongoose, { Model } from 'mongoose';
import bookSchema from '../schemas/book.schema.js';

/**
 * Mongoose model for the `Book` collection.
 *
 * This model is created using the `Book` interface and the `bookSchema`, representing the
 * `Book` collection in the MongoDB database, and provides an interface for interacting with
 * the stored books.
 *
 */
const BookModel = mongoose.model('BookModel', bookSchema);

export default BookModel;
