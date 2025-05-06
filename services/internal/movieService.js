import MovieModel from "../../models/movie.model.js";

/**
 * Retrieves the most popular movies based on the number of queues.
 * @returns An array of popular movies or an error object.
 */
export const retrievePopularMovies = async () => {
  try {
    const movies = await MovieModel.find().sort({ numQueues: -1 }).limit(5);

    if (!movies || movies.length === 0) {
      return { error: "No popular movies found." };
    }

    return movies;
  } catch (error) {
    return { error: `Error occurred when retrieving popular movies: ${error}` };
  }
};
