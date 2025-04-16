import TVModel from "../../models/tv.model.js";

export const retrievePopularTV = async () => {
  try {
    const shows = await TVModel.find().sort({ numQueues: -1 }).limit(5);
    return shows;
  } catch (error) {
    return {
      error: `Error occurred when retrieving popular tv shows: ${error}`,
    };
  }
};
