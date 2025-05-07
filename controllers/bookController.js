import { retrievePopularBooks } from "../services/internal/bookService.js";

/**
 * Handles requests just pertaining to saved database books.
 * @param app - The Express app instance
 */
export default function BookController(app) {
  /**
   * Handles requests to get popular books.
   * @param req - The request object
   * @param res - The response object containing the popular books
   */
  const getPopularBooks = async (req, res) => {
    try {
      const results = await retrievePopularBooks();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  app.get("/api/books/popular", getPopularBooks);
}
