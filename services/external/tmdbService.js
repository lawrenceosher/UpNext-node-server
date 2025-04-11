// services/tmdbService.ts
import axios from 'axios';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';


export async function searchMoviesTMDB(query) {
    const searchUrl = `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`;
    const searchRes = await axios.get(searchUrl);
    const movies = searchRes.data.results;
  
    const normalizedResults = await Promise.all(movies.map(async (movie) => {
      try {
        const [details, credits] = await Promise.all([
          axios.get(`${TMDB_BASE}/movie/${movie.id}?api_key=${API_KEY}`),
          axios.get(`${TMDB_BASE}/movie/${movie.id}/credits?api_key=${API_KEY}`)
        ]);
  
        const director = credits.data.crew.find((c) => c.job === 'Director')?.name || '';
        const cast = credits.data.cast.slice(0, 5).map((actor) => actor.name);
        const genres = details.data.genres.map((g) => g.name);
  
        return {
          _id: movie.id.toString(),
          title: movie.title,
          director,
          description: movie.overview,
          releaseDate: movie.release_date,
          posterPath: movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : '',
          cast,
          genres,
          sourceUrl: `https://www.themoviedb.org/movie/${movie.id}`
        };
      } catch (err) {
        console.error(`Error fetching details for movie ${movie.id}`, err);
        return null;
      }
    }));
  
    return normalizedResults.filter(Boolean);
  }

export async function getTMDBDetails(id, type) {
  const [details, credits] = await Promise.all([
    axios.get(`${TMDB_BASE}/${type}/${id}?api_key=${API_KEY}`),
    axios.get(`${TMDB_BASE}/${type}/${id}/credits?api_key=${API_KEY}`)
  ]);

  const director = credits.data.crew.find((c) => c.job === 'Director')?.name;
  const cast = credits.data.cast.slice(0, 5).map((c) => c.name);

  return {
    tmdbId: id,
    title: details.data.title || details.data.name,
    type,
    description: details.data.overview,
    release_date: details.data.release_date || details.data.first_air_date,
    image: details.data.poster_path ? `https://image.tmdb.org/t/p/w500${details.data.poster_path}` : null,
    rating: details.data.vote_average,
    genres: details.data.genres.map((g) => g.name),
    director,
    cast,
    source_url: `https://www.themoviedb.org/${type}/${id}`
  };
}
