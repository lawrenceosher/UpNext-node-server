import axios from "axios";

const TMDB_BASE = "https://api.themoviedb.org/3";
const API_KEY = process.env.TMDB_API_KEY;

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// Function that will normalize the movie data from TMDB in the format that UpNext expects
async function normalizeMoviesFromTMDB(movies) {
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

export async function searchMoviesTMDB(query) {
  const searchUrl = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(
    query
  )}&api_key=${API_KEY}`;
  const searchRes = await axios.get(searchUrl);
  const movies = searchRes.data.results;

  const normalizedResults = await normalizeMoviesFromTMDB(movies);

  return normalizedResults.filter(Boolean);
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

export async function searchTVShowsTMDB(query) {
  const searchUrl = `${TMDB_BASE}/search/tv?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
  const searchRes = await axios.get(searchUrl);
  const shows = searchRes.data.results;

  const normalizedResults = await Promise.all(shows.map(async (show) => {
    try {
      const [details, credits] = await Promise.all([
        axios.get(`${TMDB_BASE}/tv/${show.id}?api_key=${API_KEY}`),
        axios.get(`${TMDB_BASE}/tv/${show.id}/credits?api_key=${API_KEY}`)
      ]);

      const cast = credits.data.cast.slice(0, 5).map((actor) => actor.name);
      const genres = details.data.genres.map((g) => g.name);
      const creator = details.data.created_by?.[0]?.name || '';

      return {
        _id: show.id.toString(),
        title: show.name,
        posterPath: show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : '',
        description: show.overview,
        firstAirDate: show.first_air_date,
        lastAirDate: details.data.last_air_date,
        genres,
        cast,
        creator,
        totalEpisodes: details.data.number_of_episodes,
        totalSeasons: details.data.number_of_seasons,
        sourceUrl: `https://www.themoviedb.org/tv/${show.id}`
      };
    } catch (err) {
      console.error(`Error fetching TV details for ${show.id}`, err);
      return null;
    }
  }));

  return normalizedResults.filter(Boolean);
}

export async function getTVShowById(id) {
  const [detailsRes, creditsRes] = await Promise.all([
    axios.get(`${TMDB_BASE}/tv/${id}?api_key=${API_KEY}`),
    axios.get(`${TMDB_BASE}/tv/${id}/credits?api_key=${API_KEY}`)
  ]);

  const details = detailsRes.data;
  const credits = creditsRes.data;

  const cast = credits.cast.slice(0, 5).map((actor) => actor.name);
  const genres = details.genres.map((g) => g.name);
  const creator = details.created_by?.[0]?.name || '';

  return {
    _id: id,
    title: details.name,
    posterPath: details.poster_path ? `${IMAGE_BASE}${details.poster_path}` : '',
    description: details.overview,
    firstAirDate: details.first_air_date,
    lastAirDate: details.last_air_date,
    genres,
    cast,
    creator,
    totalEpisodes: details.number_of_episodes,
    totalSeasons: details.number_of_seasons,
    sourceUrl: `https://www.themoviedb.org/tv/${id}`
  };
}



