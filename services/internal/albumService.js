import AlbumModel from "../../models/album.model.js";

export const retrievePopularAlbums = async () => {
  try {
    const albums = await AlbumModel.find().sort({ numQueues: -1 }).limit(5);
    return albums;
  } catch (error) {
    return { error: `Error occurred when retrieving popular albums: ${error}` };
  }
};