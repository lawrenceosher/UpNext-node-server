import AlbumModel from "../../models/album.model.js";

/**
 * Retrieves the most popular albums based on the number of queues.
 * @returns An array of popular albums or an error object.
 */
export const retrievePopularAlbums = async () => {
  try {
    const albums = await AlbumModel.find().sort({ numQueues: -1 }).limit(5);

    if (!albums || albums.length === 0) {
      return { error: "No popular albums found." };
    }

    return albums;
  } catch (error) {
    return { error: `Error occurred when retrieving popular albums: ${error}` };
  }
};
