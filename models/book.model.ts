import mongoose, { Model } from 'mongoose';
import bookSchema from '../schemas/book.schema';
import { Book } from '../types/book.d';

/**
 * Mongoose model for the `Book` collection.
 *
 * This model is created using the `Book` interface and the `bookSchema`, representing the
 * `Book` collection in the MongoDB database, and provides an interface for interacting with
 * the stored books.
 *
 * @type {Model<Book>}
 */
const BookModel: Model<Book> = mongoose.model<Book>('BookModel', bookSchema);

export default BookModel;
