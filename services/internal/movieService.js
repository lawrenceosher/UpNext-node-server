import MovieModel from "../../models/movie.model.js";

export const retrievePopularMovies = async () => {
  try {
    const movies = await MovieModel.find().sort({ numQueues: -1 }).limit(5);
    return movies;
  } catch (error) {
    return { error: `Error occurred when retrieving popular movies: ${error}` };
  }
};
