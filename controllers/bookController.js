import { retrievePopularBooks } from "../services/internal/bookService.js";

export default function BookController(app) {
  const getPopularBooks = async (req, res) => {
    const results = await retrievePopularBooks();
    res.json(results);
  };

  app.get("/api/books/popular", getPopularBooks);
}
