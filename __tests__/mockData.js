import { v4 as uuidv4 } from "uuid";

export const groupId = uuidv4();
export const movieQueueId = uuidv4();
export const tvQueueId = uuidv4();
export const albumQueueId = uuidv4();
export const bookQueueId = uuidv4();
export const videoGameQueueId = uuidv4();
export const podcastQueueId = uuidv4();

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
  _id: tvQueueId,
  mediaType: "TV",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "TVModel",
};

export const mockAlbumQueue = {
  _id: albumQueueId,
  mediaType: "Album",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "AlbumModel",
};

export const mockBookQueue = {
  _id: bookQueueId,
  mediaType: "Book",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "BookModel",
};

export const mockVideoGameQueue = {
  _id: videoGameQueueId,
  mediaType: "VideoGame",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "VideoGameModel",
};

export const mockPodcastQueue = {
  _id: podcastQueueId,
  mediaType: "Podcast",
  users: [testUsername],
  group: groupId,
  current: [],
  history: [],
  media: "PodcastModel",
};
