import { retrievePopularMovies } from "../services/internal/movieService.js";

/**
 * Handles requests just pertaining to saved database movies.
 * @param app - The Express app instance
 */
export default function MovieController(app) {
  /**
   * Handles requests to get popular movies.
   * @param req - The request object
   * @param res - The response object containing the popular movies
   */
  const getPopularMovies = async (req, res) => {
    try {
      const results = await retrievePopularMovies();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  app.get("/api/movies/popular", getPopularMovies);
}
