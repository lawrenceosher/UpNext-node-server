import * as mockingoose from "mockingoose";
import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import TVModel from "../../models/tv.model.js";
import AlbumModel from "../../models/album.model.js";
import BookModel from "../../models/book.model.js";
import VideoGameModel from "../../models/game.model.js";
import PodcastModel from "../../models/podcast.model.js";
import { createAlbumQueue, createMovieQueue, createTVQueue, createBookQueue, createPodcastQueue, createVideoGameQueue } from "../../services/internal/queueService.js";
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
  }
  );

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
});
