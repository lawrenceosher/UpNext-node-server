import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import { v4 as uuidv4 } from "uuid";

export async function createMovieQueue(username, group) {
  const newMovieQueue = {
    _id: uuidv4(),
    mediaType: "Movie",
    users: [username],
    group,
    current: [],
    history: [],
    media: "MovieModel",
  };

  return await QueueModel.create(newMovieQueue);
}

export async function createTVQueue(username, group) {
  const newTVQueue = {
    _id: uuidv4(),
    mediaType: "TV",
    users: [username],
    group,
    current: [],
    history: [],
    media: "TVModel",
  };

  return await QueueModel.create(newTVQueue);
}

export async function createAlbumQueue(username, group) {
  const newAlbumQueue = {
    _id: uuidv4(),
    mediaType: "Album",
    users: [username],
    group,
    current: [],
    history: [],
    media: "AlbumModel",
  };

  return await QueueModel.create(newAlbumQueue);
}

export async function createBookQueue(username, group) {
  const newBookQueue = {
    _id: uuidv4(),
    mediaType: "Book",
    users: [username],
    group,
    current: [],
    history: [],
    media: "BookModel",
  };

  return await QueueModel.create(newBookQueue);
}

export async function createVideoGameQueue(username, group) {
  const newVideoGameQueue = {
    _id: uuidv4(),
    mediaType: "Video Game",
    users: [username],
    group,
    current: [],
    history: [],
    media: "VideoGameModel",
  };

  return await QueueModel.create(newVideoGameQueue);
}

export async function createPodcastQueue(username, group) {
  const newPodcastQueue = {
    _id: uuidv4(),
    mediaType: "Podcast",
    users: [username],
    group,
    current: [],
    history: [],
    media: "PodcastModel",
  };

  return await QueueModel.create(newPodcastQueue);
}

export async function getQueueByMediaTypeAndUsername(mediaType, username) {
  const queue = await QueueModel.findOne({
    mediaType,
    users: { $in: [username] },
  }).populate({ path: 'current', model: `${mediaType}Model` });
  return queue;
}

export async function addMediaToQueue(mediaType, queueId, media) {

  const currentQueue = await QueueModel.findOne({ _id: queueId }).select('current');

  if (currentQueue && currentQueue.current.includes(media._id)) {
    throw new Error("Media already in queue");
  }

  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    { $addToSet: { current: media._id } },
    { new: true }
  ).populate({ path: 'current', model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  if (mediaType === "Movie") {
    await MovieModel.create(media);
  }

  return queue;
}
