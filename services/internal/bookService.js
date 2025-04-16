import BookModel from "../../models/book.model.js";

export const retrievePopularBooks = async () => {
  try {
    const books = await BookModel.find().sort({ numQueues: -1 }).limit(5);
    return books;
  } catch (error) {
    return { error: `Error occurred when retrieving popular books: ${error}` };
  }
}