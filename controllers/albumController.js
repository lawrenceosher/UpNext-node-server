import { retrievePopularAlbums } from "../services/internal/albumService.js";

/**
 * Handles requests just pertaining to saved database albums.
 * @param app - The Express app instance
 */
export default function AlbumController(app) {
  /**
   * Handles requests to get popular albums.
   * @param req - The request object
   * @param res - The response object containing the popular albums
   */
  const getPopularAlbums = async (req, res) => {
    try {
      const results = await retrievePopularAlbums();
      res.json(results);
    } catch (error) {
      res.status(500).json(error.message);
    }
  };

  app.get("/api/albums/popular", getPopularAlbums);
}
