import {
  searchMoviesTMDB,
  getMovieById,
} from "../services/external/tmdbService.js";

export default function QueueController(app) {
  app.get("/api/queue/:mediaType/search", async (req, res) => {
    const { mediaType } = req.params;
    if (mediaType === "movie") {
      const { query } = req.query;
      const results = await searchMoviesTMDB(query);
      res.json(results);
    } else {
      res.status(400).json({ error: "Invalid media type" });
    }
  });

  app.get("/api/:mediaType/:id", async (req, res) => {
    const { mediaType, id } = req.params;
    if (mediaType === "movie") {
      const results = await getMovieById(id);
      res.json(results);
    } else {
      res.status(400).json({ error: "Invalid media type" });
    }
  });
}
