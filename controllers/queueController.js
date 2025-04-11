import {
  searchMoviesTMDB,
  searchTVShowsTMDB,
  getMovieById,
  getTVShowById,
} from "../services/external/tmdbService.js";

export default function QueueController(app) {
  const searchMovies = async (req, res) => {
    const { query } = req.query;
    const results = await searchMoviesTMDB(query);
    res.json(results);
  };
  const getMovieDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getMovieById(id);
    res.json(results);
  };

  const searchTVShows = async (req, res) => {
    const { query } = req.query;
    const results = await searchTVShowsTMDB(query);
    res.json(results);
  };
  const getTVShowDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getTVShowById(id);
    res.json(results);
  };

  const searchMedia = async (req, res) => {
    const { mediaType } = req.params;
    if (mediaType === "movie") {
      searchMovies(req, res);
    } else if (mediaType === "tv") {
      searchTVShows(req, res);
    } else {
      res.status(400).json({ error: "Invalid media type" });
    }
  };

  const getMediaDetails = async (req, res) => {
    const { mediaType, id } = req.params;
    if (mediaType === "movie") {
      getMovieDetails(req, res);
    } else if (mediaType === "tv") {
      getTVShowDetails(req, res);
    } else {
      res.status(400).json({ error: "Invalid media type" });
    }
  };

  app.get("/api/queue/:mediaType/search", searchMedia);
  app.get("/api/media/:mediaType/:id", getMediaDetails);
}
