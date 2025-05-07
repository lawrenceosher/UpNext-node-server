import BookModel from "../../models/book.model.js";

/**
 * Retrieves the most popular books based on the number of queues.
 * @returns An array of popular books or an error object.
 */
export const retrievePopularBooks = async () => {
  try {
    const books = await BookModel.find().sort({ numQueues: -1 }).limit(5);

    if (!books || books.length === 0) {
      return { error: "No popular books found." };
    }

    return books;
  } catch (error) {
    return { error: `Error occurred when retrieving popular books: ${error}` };
  }
};
