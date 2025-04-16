import { retrievePopularTV } from "../services/internal/tvService.js";

export default function TVController(app) {
  const getPopularTVShows = async (req, res) => {
    const results = await retrievePopularTV();
    res.json(results);
  };

  app.get("/api/tv/popular", getPopularTVShows);
}
