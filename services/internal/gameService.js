import VideoGameModel from "../../models/game.model.js";

/**
 * Retrieves the most popular video games based on the number of queues.
 * @returns An array of popular video games or an error object.
 */
export const retrievePopularGames = async () => {
  try {
    const games = await VideoGameModel.find().sort({ numQueues: -1 }).limit(5);

    if (!games || games.length === 0) {
      return { error: "No popular games found." };
    }

    return games;
  } catch (error) {
    return { error: `Error occurred when retrieving popular games: ${error}` };
  }
};
