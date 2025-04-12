import {
  searchMoviesTMDB,
  searchTVShowsTMDB,
  getMovieById,
  getTVShowById,
} from "../services/external/tmdbService.js";
import { getQueueByMediaTypeAndUsername, addMediaToQueue } from "../services/internal/queueService.js";

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

  const fetchQueueByMediaTypeAndUsername = async (req, res) => {
    const { mediaType, username } = req.params;

    try {
      const resultQueue = await getQueueByMediaTypeAndUsername(
        mediaType,
        username
      );

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json({ error: `Error when saving user: ${error}` });
    }
  };

  const addMediaToExistingQueue = async (req, res) => {
    const { mediaType, queueId } = req.params;
    const { media } = req.body;

    try {
      const resultQueue = await addMediaToQueue(mediaType, queueId, media);

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  app.get("/api/queue/:mediaType/search", searchMedia);
  app.get("/api/media/:mediaType/:id", getMediaDetails);
  app.get("/api/queue/:mediaType/users/:username", fetchQueueByMediaTypeAndUsername);
  app.put("/api/queue/:mediaType/:queueId/addToCurrent", addMediaToExistingQueue);
}
