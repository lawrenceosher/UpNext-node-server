import QueueModel from "../../models/queue.model";
import { v4 as uuidv4 } from "uuid";

export async function createMovieQueue(username, group) {
  const newMovieQueue = {
    _id: new uuidv4(),
    mediaType: "Movie",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newMovieQueue);
}

export async function createTVQueue(username, group) {
  const newTVQueue = {
    _id: new uuidv4(),
    mediaType: "TV",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newTVQueue);
}

export async function createAlbumQueue(username, group) {
  const newAlbumQueue = {
    _id: new uuidv4(),
    mediaType: "Album",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newAlbumQueue);
}

export async function createBookQueue(username, group) {
  const newBookQueue = {
    _id: new uuidv4(),
    mediaType: "Book",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newBookQueue);
}

export async function createVideoGameQueue(username, group) {
  const newVideoGameQueue = {
    _id: new uuidv4(),
    mediaType: "Video Game",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newVideoGameQueue);
}

export async function createPodcastQueue(username, group) {
  const newPodcastQueue = {
    _id: new uuidv4(),
    mediaType: "Podcast",
    users: [username],
    group,
    current: [],
    history: [],
  };

  return await QueueModel.create(newPodcastQueue);
}
