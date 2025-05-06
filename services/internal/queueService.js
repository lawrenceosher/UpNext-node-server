import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import TVModel from "../../models/tv.model.js";
import AlbumModel from "../../models/album.model.js";
import BookModel from "../../models/book.model.js";
import VideoGameModel from "../../models/game.model.js";
import PodcastModel from "../../models/podcast.model.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new Movie queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createMovieQueue(usernames, group) {
  try {
    const newMovieQueue = {
      _id: uuidv4(),
      mediaType: "Movie",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "MovieModel",
    };

    const resultQueue = await QueueModel.create(newMovieQueue);

    if (!resultQueue) {
      throw new Error("Error creating Movie queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Creates a new TV queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createTVQueue(usernames, group) {
  try {
    const newTVQueue = {
      _id: uuidv4(),
      mediaType: "TV",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "TVModel",
    };

    const resultQueue = await QueueModel.create(newTVQueue);

    if (!resultQueue) {
      throw new Error("Error creating TV queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Creates a new Album queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createAlbumQueue(usernames, group) {
  try {
    const newAlbumQueue = {
      _id: uuidv4(),
      mediaType: "Album",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "AlbumModel",
    };

    const resultQueue = await QueueModel.create(newAlbumQueue);

    if (!resultQueue) {
      throw new Error("Error creating Album queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Creates a new Book queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createBookQueue(usernames, group) {
  try {
    const newBookQueue = {
      _id: uuidv4(),
      mediaType: "Book",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "BookModel",
    };

    const resultQueue = await QueueModel.create(newBookQueue);

    if (!resultQueue) {
      throw new Error("Error creating Book queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Creates a new VideoGame queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createVideoGameQueue(usernames, group) {
  try {
    const newVideoGameQueue = {
      _id: uuidv4(),
      mediaType: "VideoGame",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "VideoGameModel",
    };

    const resultQueue = await QueueModel.create(newVideoGameQueue);

    if (!resultQueue) {
      throw new Error("Error creating Video Game queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Creates a new Podcast queue for specific users and group
 * @param usernames - The usernames of the users to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The created queue object or an error message
 */
export async function createPodcastQueue(usernames, group) {
  try {
    const newPodcastQueue = {
      _id: uuidv4(),
      mediaType: "Podcast",
      users: Array.isArray(usernames) ? [...usernames] : [usernames],
      group,
      current: [],
      history: [],
      media: "PodcastModel",
    };

    const resultQueue = await QueueModel.create(newPodcastQueue);

    if (!resultQueue) {
      throw new Error("Error creating Podcast queue");
    }

    return resultQueue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Retrieves a queue by media type, username, and group
 * @param mediaType - The media type of the queue
 * @param username - The username the queue belongs to
 * @param group - The group the queue belongs to
 * @returns - The found queue or an error message
 */
export async function getQueueByMediaTypeAndUsernameAndGroup(
  mediaType,
  username,
  group
) {
  try {
    const queue = await QueueModel.findOne({
      mediaType,
      users: { $in: [username] },
      group,
    })
      .populate({ path: "current", model: `${mediaType}Model` })
      .populate({ path: "history", model: `${mediaType}Model` });

    if (!queue) {
      throw new Error(
        `${mediaType} Queue not found for user ${username} and group ${group}`
      );
    }

    return queue;
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Adds the media to the current queue for the specified media type and queue ID
 * @param mediaType - The media type of the queue
 * @param queueId - The ID of the queue
 * @param media - The media object to add to the queue
 * @returns - The updated queue or an error message
 */
export async function addMediaToQueue(mediaType, queueId, media) {
  try {
    // Find the existing queue
    const currentQueue = await QueueModel.findOne({ _id: queueId });

    // Check if the media is already in the queue - if so throw an error since duplicates are not allowed
    if (
      (currentQueue && currentQueue.current.includes(media._id)) ||
      currentQueue.history.includes(media._id)
    ) {
      throw new Error("Media already in queue");
    }

    if (mediaType === "Movie") {
      // Check if the movie is already in the database
      const movie = await MovieModel.findOne({ _id: media._id });

      // If not, create a new movie entry
      if (!movie) {
        await MovieModel.create(media);
      }

      // Increment the numQueues field for the movie to track how many queues it is in
      await MovieModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    if (mediaType === "TV") {
      // Check if the TV show is already in the database
      const show = await TVModel.findOne({ _id: media._id });

      // If not, create a new TV show entry
      if (!show) {
        await TVModel.create(media);
      }

      // Increment the numQueues field for the TV show to track how many queues it is in
      await TVModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    if (mediaType === "Album") {
      // Check if the album is already in the database
      const album = await AlbumModel.findOne({ _id: media._id });

      // If not, create a new album entry
      if (!album) {
        await AlbumModel.create(media);
      }

      // Increment the numQueues field for the album to track how many queues it is in
      await AlbumModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    if (mediaType === "Book") {
      // Check if the book is already in the database
      const book = await BookModel.findOne({ _id: media._id });

      // If not, create a new book entry
      if (!book) {
        await BookModel.create(media);
      }

      // Increment the numQueues field for the book to track how many queues it is in
      await BookModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    if (mediaType === "VideoGame") {
      // Check if the video game is already in the database
      const videoGames = await VideoGameModel.findOne({ _id: media._id });

      // If not, create a new video game entry
      if (!videoGames) {
        await VideoGameModel.create(media);
      }

      // Increment the numQueues field for the video game to track how many queues it is in
      await VideoGameModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    if (mediaType === "Podcast") {
      // Check if the podcast is already in the database
      const podcasts = await PodcastModel.findOne({ _id: media._id });

      // If not, create a new podcast entry
      if (!podcasts) {
        await PodcastModel.create(media);
      }

      // Increment the numQueues field for the podcast to track how many queues it is in
      await PodcastModel.findOneAndUpdate(
        { _id: media._id },
        { $inc: { numQueues: 1 } }
      );
    }

    // Add the media to the current queue
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
  } catch (error) {
    return { error: `Failed to add media to queue: ${error.message}` };
  }
}

/**
 * Moves media from the current queue to the history queue
 * @param mediaType - The media type of the queue
 * @param queueId - The ID of the queue
 * @param mediaIDs - The IDs of the media objects to move
 * @returns - The updated queue or an error message
 */
export async function moveMediaFromCurrentToHistory(
  mediaType,
  queueId,
  mediaIDs
) {
  try {
    // Remove each of the media objects from the current queue and add them to the history queue
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
  } catch (error) {
    return {
      error: `Failed to move media from current to history: ${error.message}`,
    };
  }
}

/**
 * Decrements the numQueues field for the specified media type and ID to track how many queues it is in
 * @param mediaType - The media type of the queue
 * @param mediaId - The ID of the media object to decrement
 */
async function decrementNumQueues(mediaType, mediaId) {
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
}

/**
 * Deletes media from the current queue for the specified media type and queue ID
 * @param mediaType - The media type of the queue
 * @param queueId - The ID of the queue
 * @param mediaId - The ID of the media object to delete
 * @returns - The updated queue or an error message
 */
export async function deleteMediaFromCurrentQueue(mediaType, queueId, mediaId) {
  try {
    // Remove the media from the current queue
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

    // Decrement the numQueues field for the media to track how many queues it is in
    await decrementNumQueues(mediaType, mediaId);

    return queue;
  } catch (error) {
    return {
      error: `Failed to delete media from current queue: ${error.message}`,
    };
  }
}

/**
 * Deletes media from the history queue for the specified media type and queue ID
 * @param mediaType - The media type of the queue
 * @param queueId - The ID of the queue
 * @param mediaId - The ID of the media object to delete
 * @returns - The updated queue or an error message
 */
export async function deleteMediaFromHistoryQueue(mediaType, queueId, mediaId) {
  try {
    // Remove the media from the history queue
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

    // Decrement the numQueues field for the media to track how many queues it is in
    await decrementNumQueues(mediaType, mediaId);

    return queue;
  } catch (error) {
    return {
      error: `Failed to delete media from history queue: ${error.message}`,
    };
  }
}

/**
 * Retrieves the top 3 media in the current queue for the specified media type, username, and group
 * @param mediaType - The media type of the queue
 * @param username - The username the queue belongs to
 * @param group - The group the queue belongs to
 * @returns - The top 3 media in the current queue or an error message
 */
export async function retrieveTop3inCurrentQueue(mediaType, username, group) {
  try {
    // Find the queue for the specified media type, username, and group
    // and limit the current array to the first 3 elements
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
  } catch (error) {
    return {
      error: `Failed to retrieve top 3 in current queue: ${error.message}`,
    };
  }
}

/**
 * Retrieves the top 3 media in the personal history for the specified media type, username, and group
 * @param mediaType - The media type of the queue
 * @param username - The username the queue belongs to
 * @param group - The group the queue belongs to
 * @returns - The top 3 media in the personal history or an error message
 */
export async function retrieveTop3inPersonalHistory(
  mediaType,
  username,
  group
) {
  try {
    // Find the queue for the specified media type, username, and group
    // and limit the history array to the first 3 elements
    const queue = await QueueModel.findOne(
      {
        mediaType,
        users: { $in: [username] },
        group,
      },
      { history: { $slice: 3 } }
    )
      .select("history")
      .populate({ path: "history", model: `${mediaType}Model` });

    if (!queue) {
      throw new Error("Queue not found");
    }

    return queue;
  } catch (error) {
    return {
      error: `Failed to retrieve top 3 in personal history: ${error.message}`,
    };
  }
}

/**
 * Deletes a queue by media type and group
 * @param mediaType - The media type of the queue
 * @param group - The group the queue belongs to
 * @returns - The deleted queue or an error message
 */
export async function deleteQueueByMediaTypeAndGroup(mediaType, group) {
  try {
    // Find the queue for the specified media type and group and delete it
    const deletedQueues = await QueueModel.deleteMany({
      mediaType,
      group,
    });

    if (!deletedQueues) {
      throw new Error("Queue not found");
    }

    return deletedQueues;
  } catch (error) {
    return {
      error: `Failed to delete queue: ${error.message}`,
    };
  }
}

/**
 * Deletes a queue by media type, username, and group
 * @param mediaType - The media type of the queue
 * @param username - The username the queue belongs to
 * @param group - The group the queue belongs to
 * @returns - The deleted queue or an error message
 */
export async function deleteQueueByMediaTypeAndUsernameAndGroup(
  mediaType,
  username,
  group
) {
  try {
    // Find the queue for the specified media type, username, and group and delete it
    const deletedQueues = await QueueModel.deleteMany({
      mediaType,
      users: { $in: [username] },
      group,
    });

    if (!deletedQueues) {
      throw new Error("Queue not found");
    }

    return deletedQueues;
  } catch (error) {
    return {
      error: `Failed to delete queue: ${error.message}`,
    };
  }
}

/**
 * Adds a user to the queue for the specified media type and group
 * @param mediaType - The media type of the queue
 * @param username - The username to add to the queue
 * @param group - The group the queue belongs to
 * @returns - The updated queue or an error message
 */
async function addUserToQueue(mediaType, username, group) {
  try {
    const updatedQueue = await QueueModel.findOneAndUpdate(
      { mediaType, group },
      { $addToSet: { users: username } },
      { new: true }
    );

    if (!updatedQueue) {
      throw new Error(
        `Queue not found for media type ${mediaType} and group ${group}`
      );
    }

    return updatedQueue;
  } catch (error) {
    return { error: `Failed to add user to queue: ${error.message}` };
  }
}

/**
 * Adds a user to all group queues for the all media types
 * @param username - The username to add to the queues
 * @param group - The group the queues belong to
 * @returns - The updated queues or an error message
 */
export async function addUserToAllGroupQueues(username, group) {
  try {
    // Add the user to the group queue for each media type
    const updatedMovieQueue = await addUserToQueue("Movie", username, group);
    const updatedTVQueue = await addUserToQueue("TV", username, group);
    const updatedAlbumQueue = await addUserToQueue("Album", username, group);
    const updatedBookQueue = await addUserToQueue("Book", username, group);
    const updatedVideoGameQueue = await addUserToQueue(
      "VideoGame",
      username,
      group
    );
    const updatedPodcastQueue = await addUserToQueue(
      "Podcast",
      username,
      group
    );

    if (
      !updatedMovieQueue ||
      !updatedTVQueue ||
      !updatedAlbumQueue ||
      !updatedBookQueue ||
      !updatedVideoGameQueue ||
      !updatedPodcastQueue
    ) {
      throw new Error("Error adding user to all group queues");
    }

    return {
      updatedMovieQueue,
      updatedTVQueue,
      updatedAlbumQueue,
      updatedBookQueue,
      updatedVideoGameQueue,
      updatedPodcastQueue,
    };
  } catch (error) {
    return { error: error.message };
  }
}
