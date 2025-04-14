import {
  searchMoviesTMDB,
  searchTVShowsTMDB,
  getMovieById,
  getTVShowById,
} from "../services/external/tmdbService.js";
import {
  searchSpotifyAlbums,
  getAlbumDetailsFromSpotify,
  searchSpotifyPodcasts,
  getPodcastDetailsFromSpotify,
} from "../services/external/spotifyService.js";
import {
  searchIGDBGames,
  fetchGameById,
} from "../services/external/igdbService.js";
import {
  searchGoogleBooks,
  fetchGoogleBookById,
} from "../services/external/googleBooksService.js";
import {
  getQueueByMediaTypeAndUsername,
  addMediaToQueue,
  moveMediaFromCurrentToHistory,
  deleteMediaFromCurrentQueue,
  deleteMediaFromHistoryQueue,
  retrieveTop3inCurrentQueue,
  retrieveHistorySummary,
} from "../services/internal/queueService.js";

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

  const searchAlbums = async (req, res) => {
    const { query } = req.query;
    const results = await searchSpotifyAlbums(query);
    res.json(results);
  };
  const getAlbumDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getAlbumDetailsFromSpotify(id);
    res.json(results);
  };

  const searchPodcasts = async (req, res) => {
    const { query } = req.query;
    const results = await searchSpotifyPodcasts(query);
    res.json(results);
  };
  const getPodcastDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getPodcastDetailsFromSpotify(id);
    res.json(results);
  };

  const searchVideoGames = async (req, res) => {
    const { query } = req.query;
    const results = await searchIGDBGames(query);
    res.json(results);
  };
  const getVideoGameDetails = async (req, res) => {
    const { id } = req.params;
    const results = await fetchGameById(id);
    res.json(results);
  };

  const searchBooks = async (req, res) => {
    const { query } = req.query;
    const results = await searchGoogleBooks(query);
    res.json(results);
  };
  const getBookDetails = async (req, res) => {
    const { id } = req.params;
    const results = await fetchGoogleBookById(id);
    res.json(results);
  };

  const searchMedia = async (req, res) => {
    const { mediaType } = req.params;
    if (mediaType === "movie") {
      searchMovies(req, res);
    } else if (mediaType === "tv") {
      searchTVShows(req, res);
    } else if (mediaType === "album") {
      searchAlbums(req, res);
    } else if (mediaType === "podcast") {
      searchPodcasts(req, res);
    } else if (mediaType === "VideoGame") {
      searchVideoGames(req, res);
    } else if (mediaType === "Book") {
      searchBooks(req, res);
    } else {
      res.status(400).json({ error: "Invalid media type" });
    }
  };

  const getMediaDetails = async (req, res) => {
    const { mediaType } = req.params;
    if (mediaType === "movie") {
      getMovieDetails(req, res);
    } else if (mediaType === "tv") {
      getTVShowDetails(req, res);
    } else if (mediaType === "album") {
      getAlbumDetails(req, res);
    } else if (mediaType === "podcast") {
      getPodcastDetails(req, res);
    } else if (mediaType === "VideoGame") {
      getVideoGameDetails(req, res);
    } else if (mediaType === "Book") {
      getBookDetails(req, res);
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
  };

  const moveFromCurrentToHistory = async (req, res) => {
    const { mediaType, queueId } = req.params;
    const { mediaIDs } = req.body;

    try {
      const resultQueue = await moveMediaFromCurrentToHistory(
        mediaType,
        queueId,
        mediaIDs
      );

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  };

  const deleteFromCurrentQueue = async (req, res) => {
    const { mediaType, queueId, mediaId } = req.params;

    try {
      const resultQueue = await deleteMediaFromCurrentQueue(
        mediaType,
        queueId,
        mediaId
      );

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  };

  const deleteFromHistoryQueue = async (req, res) => {
    const { mediaType, queueId, mediaId } = req.params;

    try {
      const resultQueue = await deleteMediaFromHistoryQueue(
        mediaType,
        queueId,
        mediaId
      );

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  };

  const getTop3InCurrent = async (req, res) => {
    const { username } = req.params;

    try {
      const movieQueue = await retrieveTop3inCurrentQueue("Movie", username, null);
      const tvQueue = await retrieveTop3inCurrentQueue("TV", username, null);
      const albumQueue = await retrieveTop3inCurrentQueue("Album", username, null);
      const podcastQueue = await retrieveTop3inCurrentQueue("Podcast", username, null);
      const gameQueue = await retrieveTop3inCurrentQueue("VideoGame", username, null);
      const bookQueue = await retrieveTop3inCurrentQueue("Book", username, null);

      const resultSummary = {
        movie: movieQueue,
        tv: tvQueue,
        album: albumQueue,
        podcast: podcastQueue,
        game: gameQueue,
        book: bookQueue,
      };

      if ("error" in resultSummary) {
        throw new Error(resultSummary.error);
      }

      res.status(200).json(resultSummary);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  };

  const getPersonalHistorySummary = async (req, res) => {
    const { username } = req.params;

    try {
      const movieQueue = await retrieveHistorySummary("Movie", username, null);
      const tvQueue = await retrieveHistorySummary("TV", username, null);
      const albumQueue = await retrieveHistorySummary("Album", username, null);
      const podcastQueue = await retrieveHistorySummary("Podcast", username, null);
      const gameQueue = await retrieveHistorySummary("VideoGame", username, null);
      const bookQueue = await retrieveHistorySummary("Book", username, null);
      
      const resultSummary = {
        movie: movieQueue.history.length,
        tv: tvQueue.history.length,
        album: albumQueue.history.length,
        podcast: podcastQueue.history.length,
        game: gameQueue.history.length,
        book: bookQueue.history.length,
      };

      if ("error" in resultSummary) {
        throw new Error(resultSummary.error);
      }

      res.status(200).json(resultSummary);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }

  }

  app.get("/api/queue/:mediaType/search", searchMedia);
  app.get("/api/media/:mediaType/:id", getMediaDetails);
  app.get(
    "/api/queue/:mediaType/users/:username",
    fetchQueueByMediaTypeAndUsername
  );
  app.put(
    "/api/queue/:mediaType/:queueId/addToCurrent",
    addMediaToExistingQueue
  );
  app.put(
    "/api/queue/:mediaType/:queueId/addToHistory",
    moveFromCurrentToHistory
  );
  app.delete(
    "/api/queue/:mediaType/:queueId/current/:mediaId",
    deleteFromCurrentQueue
  );
  app.delete(
    "/api/queue/:mediaType/:queueId/history/:mediaId",
    deleteFromHistoryQueue
  );
  app.get("/api/queue/current/:username/top3", getTop3InCurrent);
  app.get("/api/queue/history/:username", getPersonalHistorySummary)
}
