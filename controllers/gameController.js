import { retrievePopularGames } from "../services/internal/gameService.js";

export default function GameController(app) {
  const getPopularGames = async (req, res) => {
    const results = await retrievePopularGames();
    res.json(results);
  };

  app.get("/api/games/popular", getPopularGames);
}
