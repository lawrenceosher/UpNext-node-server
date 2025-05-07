import { retrievePopularGames } from "../services/internal/gameService.js";

/**
 * Handles requests just pertaining to saved database games.
 * @param app - The Express app instance
 */
export default function GameController(app) {
  /**
   * Handles requests to get popular games.
   * @param req - The request object
   * @param res - The response object containing the popular games
   */
  const getPopularGames = async (req, res) => {
    try {
      const results = await retrievePopularGames();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  app.get("/api/games/popular", getPopularGames);
}
