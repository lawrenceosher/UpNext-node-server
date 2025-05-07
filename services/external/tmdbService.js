import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

/**
 * Normalizes the movie details object from TMDB API in accordance with the Movie schema.
 * @param credits - The credits object from TMDB API.
 * @param details - The details object from TMDB API.
 * @param id - The TMDB movie ID.
 * @returns A normalized movie object.
 */
const normalizeMovie = (credits, details, id) => {
  const director = credits.crew.find((c) => c.job === "Director")?.name || "";
  const cast = credits.cast.slice(0, 5).map((actor) => actor.name);
  const genres = details.genres.map((g) => g.name);

  return {
    _id: id,
    title: details.title,
    director,
    description: details.overview,
    releaseDate: details.release_date,
    posterPath: details.poster_path
      ? `${IMAGE_BASE}${details.poster_path}`
      : "",
    cast,
    genres,
    runtime: details.runtime,
    sourceUrl: `https://www.themoviedb.org/movie/${id}`,
  };
};

/**
 * Normalizes the TV show details object from TMDB API in accordance with the TV schema.
 * @param credits - The credits object from TMDB API.
 * @param details - The details object from TMDB API.
 * @param id - The TMDB TV show ID.
 * @returns A normalized TV show object.
 */
function normalizeTV(credits, details, id) {
  const cast = credits.cast.slice(0, 5).map((actor) => actor.name);
  const genres = details.genres.map((g) => g.name);
  const creator = details.created_by?.[0]?.name || "";

  return {
    _id: id,
    title: details.name,
    posterPath: details.poster_path
      ? `${IMAGE_BASE}${details.poster_path}`
      : "",
    description: details.overview,
    firstAirDate: details.first_air_date,
    lastAirDate: details.last_air_date,
    genres,
    cast,
    creator,
    totalEpisodes: details.number_of_episodes,
    totalSeasons: details.number_of_seasons,
    sourceUrl: `https://www.themoviedb.org/tv/${id}`,
  };
}

/**
 *
 * @param query - The search query
 * @returns A promise that resolves to an array of movies
 */
export async function searchMoviesTMDB(query) {
  // Encode the query in the endpoint URL to search for movies
  const searchUrl = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}`;

  // Make a GET request to the TMDB API to search for movies
  const searchRes = await axios.get(searchUrl);

  // Extract the movies from the response
  const movies = searchRes.data.results;

  const normalizedResults = await Promise.all(
    movies.map(async (movie) => {
      // For each movie, make a GET request to fetch its details
      return await getMovieById(movie.id);
    })
  );

  return normalizedResults;
}

/**
 * Fetches movie details by ID from TMDB API.
 * @param id - The TMDB movie ID.
 * @returns A promise that resolves to a movie object.
 */
export async function getMovieById(id) {
  try {
    // Fetch movie details and credits using Promise.all for parallel requests
    const [detailsRes, creditsRes] = await Promise.all([
      axios.get(`${TMDB_BASE}/movie/${id}?api_key=${API_KEY}`),
      axios.get(`${TMDB_BASE}/movie/${id}/credits?api_key=${API_KEY}`),
    ]);

    // Extract details and credits from the responses
    const details = detailsRes.data;
    const credits = creditsRes.data;

    return normalizeMovie(credits, details, id);
  } catch (err) {
    return { error: `Error fetching movie details for ${id}: ${err}` };
  }
}

/**
 * Searches for TV shows on TMDB based on a query string.
 * @param query - The search query string.
 * @returns A promise that resolves to an array of TV show objects.
 */
export async function searchTVShowsTMDB(query) {
  // Encode the query string in the endpoint URL
  const searchUrl = `${TMDB_BASE}/search/tv?query=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}`;

  // Make a GET request to the TMDB API to search for TV shows
  const searchRes = await axios.get(searchUrl);

  // Extract the TV shows from the response
  const shows = searchRes.data.results;

  const normalizedResults = await Promise.all(
    shows.map(async (show) => {
      // For each show, make a GET request to fetch its details
      return await getTVShowById(show.id);
    })
  );

  return normalizedResults;
}

/**
 * Fetches TV show details by ID from TMDB API.
 * @param id - The TMDB TV show ID.
 * @returns A promise that resolves to a TV show object.
 */
export async function getTVShowById(id) {
  try {
    // Fetch TV show details and credits using Promise.all for parallel requests
    const [detailsRes, creditsRes] = await Promise.all([
      axios.get(`${TMDB_BASE}/tv/${id}?api_key=${API_KEY}`),
      axios.get(`${TMDB_BASE}/tv/${id}/credits?api_key=${API_KEY}`),
    ]);

    // Extract details and credits from the responses
    const details = detailsRes.data;
    const credits = creditsRes.data;

    return normalizeTV(credits, details, id);
  } catch (err) {
    return { error: `Error fetching TV details for ${id}: ${err}` };
  }
}
