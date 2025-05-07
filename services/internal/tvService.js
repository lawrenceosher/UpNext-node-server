import TVModel from "../../models/tv.model.js";

/**
 * Retrieves the most popular TV shows based on the number of queues.
 * @returns An array of popular TV shows or an error object.
 */
export const retrievePopularTV = async () => {
  try {
    const shows = await TVModel.find().sort({ numQueues: -1 }).limit(5);

    if (!shows || shows.length === 0) {
      return { error: "No popular TV shows found." };
    }

    return shows;
  } catch (error) {
    return {
      error: `Error occurred when retrieving popular tv shows: ${error}`,
    };
  }
};
