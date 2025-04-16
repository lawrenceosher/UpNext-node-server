import { retrievePopularMovies } from "../services/internal/movieService.js";

export default function MovieController(app) {
  const getPopularMovies = async (req, res) => {
    const results = await retrievePopularMovies();
    res.json(results);
  };

  app.get("/api/movies/popular", getPopularMovies);
}
