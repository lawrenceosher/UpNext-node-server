import PodcastModel from "../../models/podcast.model.js";

export const retrievePopularPodcasts = async () => {
  try {
    const podcasts = await PodcastModel.find().sort({ numQueues: -1 }).limit(5);
    return podcasts;
  } catch (error) {
    return { error: `Error occurred when retrieving popular podcasts: ${error}` };
  }
}