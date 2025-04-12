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

  if (mediaType === "Movie") {
    const movies = await MovieModel.find({ _id: { $in: media._id } });
    if (!movies) {
      await MovieModel.create(media);
    }
  } else if (mediaType === "TV") {
    const shows = await TVModel.find({ _id: { $in: media._id } });
    if (!shows) {
      await TVModel.create(media);
    }
  } else if (mediaType === "Album") {
    const albums = await AlbumModel.find({ _id: { $in: media._id } });
    if (!albums) {
      await AlbumModel.create(media);
    }
  } else if (mediaType === "Book") {
    const books = await BookModel.find({ _id: { $in: media._id } });
    if (!books) {
      await BookModel.create(media);
    }
  } else if (mediaType === "VideoGame") {
    const videoGames = await VideoGameModel.find({ _id: { $in: media._id } });
    if (!videoGames) {
      await VideoGameModel.create(media);
    }
  } else if (mediaType === "Podcast") {
    const podcasts = await PodcastModel.find({ _id: { $in: media._id } });
    if (!podcasts) {
      await PodcastModel.create(media);
    }
  }

  return queue;
}

export async function moveMediaFromCurrentToHistory(mediaType, queueId, media) {
  const queue = await QueueModel.findOneAndUpdate(
    { _id: queueId },
    {
      $pull: { current: media._id },
      $addToSet: { history: media._id },
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

  return queue;
}

export async function retrieveTop3inCurrentQueue(mediaType, username) {
  const queue = await QueueModel.findOne(
    {
      mediaType,
      users: { $in: [username] },
    },
    { current: { $slice: 3 } }
  )
    .populate({ path: "current", model: `${mediaType}Model` })
    .populate({ path: "history", model: `${mediaType}Model` });

  if (!queue) {
    throw new Error("Queue not found");
  }

  return queue;
}
