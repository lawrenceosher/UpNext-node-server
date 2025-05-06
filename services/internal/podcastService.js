import PodcastModel from "../../models/podcast.model.js";

/**
 * Retrieves the most popular podcasts based on the number of queues.
 * @returns An array of popular podcasts or an error object.
 */
export const retrievePopularPodcasts = async () => {
  try {
    const podcasts = await PodcastModel.find().sort({ numQueues: -1 }).limit(5);

    if (!podcasts || podcasts.length === 0) {
      return { error: "No popular podcasts found." };
    }

    return podcasts;
  } catch (error) {
    return {
      error: `Error occurred when retrieving popular podcasts: ${error}`,
    };
  }
};
