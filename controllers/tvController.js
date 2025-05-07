import { retrievePopularTV } from "../services/internal/tvService.js";

/**
 * Handles requests just pertaining to saved database TV shows.
 * @param app - The Express app instance
 */
export default function TVController(app) {
  /**
   * Handles requests to get popular TV shows.
   * @param req - The request object
   * @param res - The response object containing the popular TV shows
   */
  const getPopularTVShows = async (req, res) => {
    try {
      const results = await retrievePopularTV();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  app.get("/api/tv/popular", getPopularTVShows);
}
