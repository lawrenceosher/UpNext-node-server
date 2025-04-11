// services/tmdbService.ts
import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export async function searchMoviesTMDB(query) {
  const searchUrl = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}`;
  const searchRes = await axios.get(searchUrl);
  const movies = searchRes.data.results;

  const normalizedResults = await normalizeMovieFromTMDB(movies);

  return normalizedResults.filter(Boolean);
}

async function normalizeMovieFromTMDB(movies) {
  return await Promise.all(
    movies.map(async (movie) => {
      try {
        const [details, credits] = await Promise.all([
          axios.get(`${TMDB_BASE}/movie/${movie.id}?api_key=${API_KEY}`),
          axios.get(
            `${TMDB_BASE}/movie/${movie.id}/credits?api_key=${API_KEY}`
          ),
        ]);

        const director = credits.data.crew.find((c) => c.job === "Director")?.name || "";
        const cast = credits.data.cast.slice(0, 5).map((actor) => actor.name);
        const genres = details.data.genres.map((g) => g.name);

        return {
          _id: movie.id.toString(),
          title: movie.title,
          director,
          description: movie.overview,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path
            ? `${IMAGE_BASE}${movie.poster_path}`
            : "",
          cast,
          genres,
          runtime: details.data.runtime,
          sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`,
        };
      } catch (err) {
        console.error(`Error fetching details for movie ${movie.id}`, err);
        return null;
      }
    })
  );
}

export async function getMovieById(id) {
  const [detailsRes, creditsRes] = await Promise.all([
    axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`),
    axios.get(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}`)
  ]);

  const details = detailsRes.data;
  const credits = creditsRes.data;

  const director = credits.crew.find((c) => c.job === 'Director')?.name || '';
  const cast = credits.cast.slice(0, 5).map((actor) => actor.name);
  const genres = details.genres.map((g) => g.name);

  return {
    _id: id,
    title: details.title,
    director,
    description: details.overview,
    releaseDate: details.release_date,
    posterPath: details.poster_path ? `${IMAGE_BASE}${details.poster_path}` : '',
    cast,
    genres,
    runtime: details.runtime,
    sourceUrl: `https://www.themoviedb.org/movie/${id}`
  };
}
