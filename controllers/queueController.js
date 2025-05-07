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
  getQueueByMediaTypeAndUsernameAndGroup,
  addMediaToQueue,
  moveMediaFromCurrentToHistory,
  deleteMediaFromCurrentQueue,
  deleteMediaFromHistoryQueue,
  retrieveTop3inCurrentQueue,
  retrieveTop3inPersonalHistory,
} from "../services/internal/queueService.js";

/**
 * Handles queue-related routes and operations such as searching for media,
 * fetching media details, and managing user queues.
 * @param app - The Express app instance
 */
export default function QueueController(app) {

  /**
   * Searches for movies using the TMDB API based on the query parameter.
   * @param req - The request object containing the search query for the TMDB API
   * @param res - The response object to send the search results
   */
  const searchMovies = async (req, res) => {
    const { query } = req.query;
    const results = await searchMoviesTMDB(query);
    res.json(results);
  };

  /**
   * Fetches movie details by ID using the TMDB API.
   * @param req - The request object containing the movie ID
   * @param res - The response object to send the movie details
   */
  const getMovieDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getMovieById(id);
    res.json(results);
  };

  /**
   * Searches for TV shows using the TMDB API based on the query parameter.
   * @param req - The request object containing the search query for the TMDB API
   * @param res - The response object to send the search results
   */
  const searchTVShows = async (req, res) => {
    const { query } = req.query;
    const results = await searchTVShowsTMDB(query);
    res.json(results);
  };

  /**
   * Fetches TV show details by ID using the TMDB API.
   * @param req - The request object containing the TV show ID
   * @param res - The response object to send the TV show details
   */
  const getTVShowDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getTVShowById(id);
    res.json(results);
  };

  /**
   * Searches for albums using the Spotify API based on the query parameter.
   * @param req - The request object containing the search query for the Spotify API
   * @param res - The response object to send the search results
   */
  const searchAlbums = async (req, res) => {
    const { query } = req.query;
    const results = await searchSpotifyAlbums(query);
    res.json(results);
  };

  /**
   * Fetches album details by ID using the Spotify API.
   * @param req - The request object containing the album ID
   * @param res - The response object to send the album details
   */
  const getAlbumDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getAlbumDetailsFromSpotify(id);
    res.json(results);
  };

  /**
   * Searches for podcasts using the Spotify API based on the query parameter.
   * @param req - The request object containing the search query for the Spotify API
   * @param res - The response object to send the search results
   */
  const searchPodcasts = async (req, res) => {
    const { query } = req.query;
    const results = await searchSpotifyPodcasts(query);
    res.json(results);
  };

  /**
   * Fetches podcast details by ID using the Spotify API.
   * @param req - The request object containing the podcast ID
   * @param res - The response object to send the podcast details
   */
  const getPodcastDetails = async (req, res) => {
    const { id } = req.params;
    const results = await getPodcastDetailsFromSpotify(id);
    res.json(results);
  };

  /**
   * Searches for video games using the IGDB API based on the query parameter.
   * @param req - The request object containing the search query for the IGDB API
   * @param res - The response object to send the search results
   */
  const searchVideoGames = async (req, res) => {
    const { query } = req.query;
    const results = await searchIGDBGames(query);
    res.json(results);
  };

  /**
   * Fetches video game details by ID using the IGDB API.
   * @param req - The request object containing the video game ID
   * @param res - The response object to send the video game details
   */
  const getVideoGameDetails = async (req, res) => {
    const { id } = req.params;
    const results = await fetchGameById(id);
    res.json(results);
  };

  /**
   * Searches for books using the Google Books API based on the query parameter.
   * @param req - The request object containing the search query for the Google Books API
   * @param res - The response object to send the search results
   */
  const searchBooks = async (req, res) => {
    const { query } = req.query;
    const results = await searchGoogleBooks(query);
    res.json(results);
  };

  /**
   * Fetches book details by ID using the Google Books API.
   * @param req - The request object containing the book ID
   * @param res - The response object to send the book details
   */
  const getBookDetails = async (req, res) => {
    const { id } = req.params;
    const results = await fetchGoogleBookById(id);
    res.json(results);
  };

  /**
   * Searches for media based on the media type and query parameters.
   * @param req - The request object containing the media type and search query
   * @param res - The response object to send the search results
   */
  const searchMedia = async (req, res) => {
    const { mediaType } = req.params;

    // Call the correct search function based on the media type
    if (mediaType === "Movie") {
      searchMovies(req, res);
    } else if (mediaType === "TV") {
      searchTVShows(req, res);
    } else if (mediaType === "Album") {
      searchAlbums(req, res);
    } else if (mediaType === "Podcast") {
      searchPodcasts(req, res);
    } else if (mediaType === "VideoGame") {
      searchVideoGames(req, res);
    } else if (mediaType === "Book") {
      searchBooks(req, res);
    } else {
      res.status(400).json("Invalid media type");
    }
  };

  /**
   * Fetches media details based on the media type and ID.
   * @param req - The request object containing the media type and ID
   * @param res - The response object to send the media details
   */
  const getMediaDetails = async (req, res) => {
    const { mediaType } = req.params;

    // Call the correct details function based on the media type
    if (mediaType === "Movie") {
      getMovieDetails(req, res);
    } else if (mediaType === "TV") {
      getTVShowDetails(req, res);
    } else if (mediaType === "Album") {
      getAlbumDetails(req, res);
    } else if (mediaType === "Podcast") {
      getPodcastDetails(req, res);
    } else if (mediaType === "VideoGame") {
      getVideoGameDetails(req, res);
    } else if (mediaType === "Book") {
      getBookDetails(req, res);
    } else {
      res.status(400).json("Invalid media type");
    }
  };

  /**
   * Fetches the queue for a specific media type and username.
   * @param req - The request object containing the media type and username
   * @param res - The response object to send the queue details
   */
  const fetchQueueByMediaTypeAndUsername = async (req, res) => {
    const { mediaType, username } = req.params;
    const { group } = req.query;

    try {
      const resultQueue = await getQueueByMediaTypeAndUsernameAndGroup(
        mediaType,
        username,
        group === "" ? null : group
      );

      if ("error" in resultQueue) {
        throw new Error(resultQueue.error);
      }

      res.status(200).json(resultQueue);
    } catch (error) {
      res.status(500).json(`Error when fetching queue: ${error.message}`);
    }
  };

  /**
   * Adds media to an existing queue based on the media type and queue ID.
   * @param req - The request object containing the media type, queue ID, and media details
   * @param res - The response object to send the updated queue details
   */
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
      res.status(500).json(error.message);
    }
  };

  /**
   * Moves media from the current queue to the history queue based on the media type and queue ID.
   * @param req - The request object containing the media type, queue ID, and media IDs
   * @param res - The response object to send the updated queue details
   */
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
      res.status(500).json(error.message);
    }
  };

  /**
   * Deletes media from the current queue based on the media type, queue ID, and media ID.
   * @param req - The request object containing the media type, queue ID, and media ID
   * @param res - The response object to send the updated queue details
   */
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
      res.status(500).json(error.message);
    }
  };

  /**
   * Deletes media from the history queue based on the media type, queue ID, and media ID.
   * @param req - The request object containing the media type, queue ID, and media ID
   * @param res - The response object to send the updated queue details
   */
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
      res.status(500).json(error.message);
    }
  };

  /**
   * Fetches the top 3 items from the current queue for each media type.
   * @param req - The request object containing the username
   * @param res - The response object to send the top 3 media items
   */
  const getTop3InCurrent = async (req, res) => {
    const { username } = req.params;

    try {
      // Fetch the top 3 items from each media type's current queue
      const movieQueue = await retrieveTop3inCurrentQueue(
        "Movie",
        username,
        null
      );
      const tvQueue = await retrieveTop3inCurrentQueue("TV", username, null);
      const albumQueue = await retrieveTop3inCurrentQueue(
        "Album",
        username,
        null
      );
      const podcastQueue = await retrieveTop3inCurrentQueue(
        "Podcast",
        username,
        null
      );
      const gameQueue = await retrieveTop3inCurrentQueue(
        "VideoGame",
        username,
        null
      );
      const bookQueue = await retrieveTop3inCurrentQueue(
        "Book",
        username,
        null
      );

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
      res.status(500).json(error.message);
    }
  };

  /**
   * Fetches the top 3 items from the history queue for each media type.
   * @param req - The request object containing the username
   * @param res - The response object to send the top 3 media items
   */
  const getTop3InHistory = async (req, res) => {
    const { username } = req.params;

    try {
      // Fetch the top 3 items from each media type's personal history
      const movieQueue = await retrieveTop3inPersonalHistory(
        "Movie",
        username,
        null
      );
      const tvQueue = await retrieveTop3inPersonalHistory("TV", username, null);
      const albumQueue = await retrieveTop3inPersonalHistory(
        "Album",
        username,
        null
      );
      const podcastQueue = await retrieveTop3inPersonalHistory(
        "Podcast",
        username,
        null
      );
      const gameQueue = await retrieveTop3inPersonalHistory(
        "VideoGame",
        username,
        null
      );
      const bookQueue = await retrieveTop3inPersonalHistory(
        "Book",
        username,
        null
      );

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
      res.status(500).json(error.message);
    }
  };

  // Routes for queue-related operations
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
  app.get("/api/queue/history/:username", getTop3InHistory);
}
