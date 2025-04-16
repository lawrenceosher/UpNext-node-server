import VideoGameModel from "../../models/game.model.js";

export const retrievePopularGames = async () => {
  try {
    const games = await VideoGameModel.find().sort({ numQueues: -1 }).limit(5);
    return games;
  } catch (error) {
    return { error: `Error occurred when retrieving popular games: ${error}` };
  }
}