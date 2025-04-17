import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import TVModel from "../../models/tv.model.js";
import AlbumModel from "../../models/album.model.js";
import BookModel from "../../models/book.model.js";
import VideoGameModel from "../../models/game.model.js";
import PodcastModel from "../../models/podcast.model.js";
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
    mediaType: "VideoGame",
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

export async function getQueueByMediaTypeAndUsernameAndGroup(
  mediaType,
  username,
  group
) {
  const queue = await QueueModel.findOne({
    mediaType,
    users: { $in: [username] },
    group,
  })
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });
  return queue;
}

export async function addMediaToQueue(mediaType, queueId, media) {
  const currentQueue = await QueueModel.findOne({ _id: queueId });

  if (
    (currentQueue && currentQueue.current.includes(media._id)) ||
    currentQueue.history.includes(media._id)
  ) {
    throw new Error("Media already in queue");
  }

  if (mediaType === "Movie") {
    const movie = await MovieModel.findOne({ _id: media._id });
    if (!movie) {
      await MovieModel.create(media);
    }
    await MovieModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  if (mediaType === "TV") {
    const show = await TVModel.findOne({ _id: media._id });
    if (!show) {
      await TVModel.create(media);
    }
    await TVModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  if (mediaType === "Album") {
    const album = await AlbumModel.findOne({ _id: media._id });
    if (!album) {
      await AlbumModel.create(media);
    }
    await AlbumModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  if (mediaType === "Book") {
    const book = await BookModel.findOne({ _id: media._id });
    if (!book) {
      await BookModel.create(media);
    }
    await BookModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  if (mediaType === "VideoGame") {
    const videoGames = await VideoGameModel.findOne({ _id: media._id });
    if (!videoGames) {
      await VideoGameModel.create(media);
    }
    await VideoGameModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  if (mediaType === "Podcast") {
    const podcasts = await PodcastModel.findOne({ _id: media._id });
    if (!podcasts) {
      await PodcastModel.create(media);
    }
    await PodcastModel.findOneAndUpdate(
      { _id: media._id },
      { $inc: { numQueues: 1 } }
    );
  }

  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    { $addToSet: { current: media._id } },
    { new: true }
  )
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  return queue;
}

export async function moveMediaFromCurrentToHistory(
  mediaType,
  queueId,
  mediaIDs
) {
  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    {
      $pull: { current: { $in: mediaIDs } },
      $addToSet: { history: { $each: mediaIDs } },
    },
    { new: true }
  )
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  return queue;
}

export async function deleteMediaFromCurrentQueue(mediaType, queueId, mediaId) {
  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    { $pull: { current: mediaId } },
    { new: true }
  )
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  if (mediaType === "Movie") {
    await MovieModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "TV") {
    await TVModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Album") {
    await AlbumModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Book") {
    await BookModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "VideoGame") {
    await VideoGameModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Podcast") {
    await PodcastModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  return queue;
}

export async function deleteMediaFromHistoryQueue(mediaType, queueId, mediaId) {
  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    { $pull: { history: mediaId } },
    { new: true }
  )
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  if (mediaType === "Movie") {
    await MovieModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "TV") {
    await TVModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Album") {
    await AlbumModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Book") {
    await BookModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "VideoGame") {
    await VideoGameModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  if (mediaType === "Podcast") {
    await PodcastModel.findOneAndUpdate(
      { _id: mediaId },
      { $inc: { numQueues: -1 } }
    );
  }

  return queue;
}

export async function retrieveTop3inCurrentQueue(mediaType, username, group) {
  const queue = await QueueModel.findOne(
    {
      mediaType,
      users: { $in: [username] },
      group,
    },
    { current: { $slice: 3 } }
  )
    .select("current")
    .populate({ path: "current", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  return queue;
}

export async function retrieveHistorySummary(mediaType, username, group) {
  const queue = await QueueModel.findOne({
    mediaType,
    users: { $in: [username] },
    group,
  }).select("history");

  if (!queue) {
    throw new Error("Queue not found");
  }

  return queue;
}

export async function findQueuesWithMedia(mediaType, mediaId) {
  const users = await QueueModel.find({
    mediaType,
    current: { $in: [mediaId] },
  }).distinct("users");

  if (!users) {
    throw new Error("Queues not found");
  }

  return users;
}
