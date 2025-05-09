export const groupId = uuidv4();
export const movieQueueId = uuidv4();

export const testUsername = "testUser";

export const mockMovieQueue = {
  _id: movieQueueId,
  mediaType: "Movie",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "MovieModel",
};

export const mockTVQueue = {
    
};
