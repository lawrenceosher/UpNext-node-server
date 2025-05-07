import { retrievePopularPodcasts } from "../services/internal/podcastService.js";

/**
 * Handles requests just pertaining to saved database podcasts.
 * @param app - The Express app instance
 */
export default function PodcastController(app) {
  /**
   * Handles requests to get popular podcasts.
   * @param req - The request object
   * @param res - The response object containing the popular podcasts
   */
  const getPopularPodcasts = async (req, res) => {
    try {
      const results = await retrievePopularPodcasts();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };
  app.get("/api/podcasts/popular", getPopularPodcasts);
}
