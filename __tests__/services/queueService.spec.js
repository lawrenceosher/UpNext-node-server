import * as mockingoose from "mockingoose";
import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import TVModel from "../../models/tv.model.js";
import AlbumModel from "../../models/album.model.js";
import BookModel from "../../models/book.model.js";
import VideoGameModel from "../../models/game.model.js";
import PodcastModel from "../../models/podcast.model.js";
import {
  createAlbumQueue,
  createMovieQueue,
  createTVQueue,
  createBookQueue,
  createPodcastQueue,
  createVideoGameQueue,
  getQueueByMediaTypeAndUsernameAndGroup,
  addMediaToQueue,
  moveMediaFromCurrentToHistory,
  deleteMediaFromCurrentQueue,
  deleteMediaFromHistoryQueue,
  retrieveTop3inCurrentQueue,
  retrieveTop3inPersonalHistory,
  deleteQueueByMediaTypeAndGroup,
  deleteQueueByMediaTypeAndUsernameAndGroup,
  addUserToAllGroupQueues,
} from "../../services/internal/queueService.js";
import {
  mockMovieQueue,
  testUsername,
  groupId,
  movieQueueId,
  mockTVQueue,
  mockAlbumQueue,
  mockVideoGameQueue,
  mockPodcastQueue,
  mockBookQueue,
  mockBatmanMovie,
} from "../mockData.js";

describe("Queue Service", () => {
  beforeEach(() => {
    mockingoose(QueueModel).reset();
    mockingoose(MovieModel).reset();
    mockingoose(TVModel).reset();
    mockingoose(AlbumModel).reset();
    mockingoose(BookModel).reset();
    mockingoose(VideoGameModel).reset();
    mockingoose(PodcastModel).reset();
    jest.clearAllMocks();
  });

  describe("createMovieQueue", () => {
    it("should create a new movie queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockMovieQueue, "create");

      // Act
      const result = await createMovieQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("Movie");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("MovieModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating movie queue"),
        "$save"
      );

      // Act
      const result = await createMovieQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating movie queue");
    });
  });

  describe("createTVQueue", () => {
    it("should create a new TV queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockTVQueue, "create");

      // Act
      const result = await createTVQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("TV");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("TVModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating TV queue"),
        "$save"
      );

      // Act
      const result = await createTVQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating TV queue");
    });
  });

  describe("createAlbumQueue", () => {
    it("should create a new album queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockAlbumQueue, "create");

      // Act
      const result = await createAlbumQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("Album");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("AlbumModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating album queue"),
        "$save"
      );

      // Act
      const result = await createAlbumQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating album queue");
    });
  });

  describe("createBookQueue", () => {
    it("should create a new book queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockBookQueue, "create");

      // Act
      const result = await createBookQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("Book");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("BookModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating book queue"),
        "$save"
      );

      // Act
      const result = await createBookQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating book queue");
    });
  });

  describe("createPodcastQueue", () => {
    it("should create a new podcast queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockPodcastQueue, "create");

      // Act
      const result = await createPodcastQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("Podcast");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("PodcastModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating podcast queue"),
        "$save"
      );

      // Act
      const result = await createPodcastQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating podcast queue");
    });
  });

  describe("createVideoGameQueue", () => {
    it("should create a new video game queue with valid inputs", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockVideoGameQueue, "create");

      // Act
      const result = await createVideoGameQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("VideoGame");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("VideoGameModel");
    });

    it("should return an error message when creating a queue fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        new Error("Error creating video game queue"),
        "$save"
      );

      // Act
      const result = await createVideoGameQueue(testUsername, groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual("Error creating video game queue");
    });
  });

  describe("getQueueByMediaTypeAndUsernameAndGroup", () => {
    it("should return the proper queue when valid username, media, and group are given", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockMovieQueue, "findOne");

      // Act
      const result = await getQueueByMediaTypeAndUsernameAndGroup(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.mediaType).toEqual("Movie");
      expect(result.users).toContain(testUsername);
      expect(result.group).toEqual(groupId);
      expect(result.current).toEqual([]);
      expect(result.history).toEqual([]);
      expect(result.media).toEqual("MovieModel");
    });

    it("should return an error message when a queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(undefined, "findOne");

      // Act
      const result = await getQueueByMediaTypeAndUsernameAndGroup(
        "Movie",
        "nonexistent",
        groupId
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toEqual(
        `Movie Queue not found for user nonexistent and group ${groupId}`
      );
    });
  });

  describe("addMediaToQueue", () => {
    it("should add the movie to the existing queue", async () => {
      // Arrange
      const updatedMovieQueue = {
        ...mockMovieQueue,
        current: [mockBatmanMovie._id],
      };
      mockingoose(QueueModel).toReturn(mockMovieQueue, "findOne");
      mockingoose(MovieModel).toReturn(null, "findOne"); // Movie not in DB
      mockingoose(MovieModel).toReturn({}, "create");
      mockingoose(MovieModel).toReturn({}, "findOneAndUpdate");
      mockingoose(QueueModel).toReturn(updatedMovieQueue, "findOneAndUpdate");

      // Act
      const result = await addMediaToQueue(
        "Movie",
        movieQueueId,
        mockBatmanMovie
      );

      // Assert
      expect(result.current).toContain(mockBatmanMovie._id);
    });

    it("should return error when media is already in queue", async () => {
      // Arrange
      const queueWithMedia = {
        ...mockMovieQueue,
        current: [mockBatmanMovie._id],
      };
      mockingoose(QueueModel).toReturn(queueWithMedia, "findOne");

      // Act
      const result = await addMediaToQueue(
        "Movie",
        movieQueueId,
        mockBatmanMovie
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Media already in queue");
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(mockMovieQueue, "findOne");
      mockingoose(MovieModel).toReturn(null, "findOne");
      mockingoose(MovieModel).toReturn({}, "create");
      mockingoose(MovieModel).toReturn({}, "findOneAndUpdate");
      mockingoose(QueueModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await addMediaToQueue(
        "Movie",
        movieQueueId,
        mockBatmanMovie
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("moveMediaFromCurrentToHistory", () => {
    it("should move media from current to history", async () => {
      // Arrange
      const mediaId = "123456";
      const initialQueue = {
        ...mockMovieQueue,
        current: [mediaId],
        history: [],
      };
      const updatedQueue = {
        ...mockMovieQueue,
        current: [],
        history: [mediaId],
      };
      mockingoose(QueueModel).toReturn(updatedQueue, "findOneAndUpdate");

      // Act
      const result = await moveMediaFromCurrentToHistory(
        "Movie",
        movieQueueId,
        [mediaId]
      );

      // Assert
      expect(result.current).not.toContain(mediaId);
      expect(result.history).toContain(mediaId);
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await moveMediaFromCurrentToHistory(
        "Movie",
        movieQueueId,
        ["123456"]
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("deleteMediaFromCurrentQueue", () => {
    it("should remove media from current queue", async () => {
      // Arrange
      const mediaId = "123456";
      const updatedQueue = {
        ...mockMovieQueue,
        current: [],
      };
      mockingoose(QueueModel).toReturn(updatedQueue, "findOneAndUpdate");
      mockingoose(MovieModel).toReturn({}, "findOneAndUpdate");

      // Act
      const result = await deleteMediaFromCurrentQueue(
        "Movie",
        movieQueueId,
        mediaId
      );

      // Assert
      expect(result.current).not.toContain(mediaId);
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await deleteMediaFromCurrentQueue(
        "Movie",
        movieQueueId,
        "123456"
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to delete media");
    });
  });

  describe("deleteMediaFromHistoryQueue", () => {
    it("should remove media from history queue", async () => {
      // Arrange
      const mediaId = "123456";
      const updatedQueue = {
        ...mockMovieQueue,
        history: [],
      };
      mockingoose(QueueModel).toReturn(updatedQueue, "findOneAndUpdate");
      mockingoose(MovieModel).toReturn({}, "findOneAndUpdate");

      // Act
      const result = await deleteMediaFromHistoryQueue(
        "Movie",
        movieQueueId,
        mediaId
      );

      // Assert
      expect(result.history).not.toContain(mediaId);
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await deleteMediaFromHistoryQueue(
        "Movie",
        movieQueueId,
        "123456"
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to delete media");
    });
  });

  describe("retrieveTop3inCurrentQueue", () => {
    it("should return top 3 media from current queue", async () => {
      // Arrange
      const queueWithMedia = {
        current: ["id1", "id2", "id3"],
      };
      mockingoose(QueueModel).toReturn(queueWithMedia, "findOne");

      // Act
      const result = await retrieveTop3inCurrentQueue(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("current");
      expect(result.current.length).toBeLessThanOrEqual(3);
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "findOne");

      // Act
      const result = await retrieveTop3inCurrentQueue(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("retrieveTop3inPersonalHistory", () => {
    it("should return top 3 media from history queue", async () => {
      // Arrange
      const queueWithHistory = {
        history: ["id1", "id2", "id3"],
      };
      mockingoose(QueueModel).toReturn(queueWithHistory, "findOne");

      // Act
      const result = await retrieveTop3inPersonalHistory(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("history");
      expect(result.history.length).toBeLessThanOrEqual(3);
    });

    it("should return error when queue is not found", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "findOne");

      // Act
      const result = await retrieveTop3inPersonalHistory(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("deleteQueueByMediaTypeAndGroup", () => {
    it("should delete queues by media type and group", async () => {
      // Arrange
      const deletedResponse = { deletedCount: 1 };
      mockingoose(QueueModel).toReturn(deletedResponse, "deleteMany");

      // Act
      const result = await deleteQueueByMediaTypeAndGroup("Movie", groupId);

      // Assert
      expect(result).toHaveProperty("deletedCount");
      expect(result.deletedCount).toBeGreaterThan(0);
    });

    it("should return error when queue deletion fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "deleteMany");

      // Act
      const result = await deleteQueueByMediaTypeAndGroup("Movie", groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("deleteQueueByMediaTypeAndUsernameAndGroup", () => {
    it("should delete queues by media type, username and group", async () => {
      // Arrange
      const deletedResponse = { deletedCount: 1 };
      mockingoose(QueueModel).toReturn(deletedResponse, "deleteMany");

      // Act
      const result = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("deletedCount");
      expect(result.deletedCount).toBeGreaterThan(0);
    });

    it("should return error when queue deletion fails", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(null, "deleteMany");

      // Act
      const result = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "Movie",
        testUsername,
        groupId
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Queue not found");
    });
  });

  describe("addUserToAllGroupQueues", () => {
    it("should add user to all media type queues for a group", async () => {
      // Arrange
      mockingoose(QueueModel).toReturn(
        { ...mockMovieQueue, users: [...mockMovieQueue.users, "newUser"] },
        "findOneAndUpdate"
      );

      // Act
      const result = await addUserToAllGroupQueues("newUser", groupId);

      // Assert
      expect(result).toHaveProperty("updatedMovieQueue");
      expect(result).toHaveProperty("updatedTVQueue");
      expect(result).toHaveProperty("updatedAlbumQueue");
      expect(result).toHaveProperty("updatedBookQueue");
      expect(result).toHaveProperty("updatedVideoGameQueue");
      expect(result).toHaveProperty("updatedPodcastQueue");
    });
  });
});
