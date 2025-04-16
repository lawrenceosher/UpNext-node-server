import { retrievePopularAlbums } from "../services/internal/albumService.js";

export default function AlbumController(app) {
  const getPopularAlbums = async (req, res) => {
    const results = await retrievePopularAlbums();
    res.json(results);
  };

  app.get("/api/albums/popular", getPopularAlbums);
}
