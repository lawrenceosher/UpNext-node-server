import * as mockingoose from "mockingoose";
import { v4 as uuidv4 } from "uuid";
import QueueModel from "../../models/queue.model.js";
import MovieModel from "../../models/movie.model.js";
import TVModel from "../../models/tv.model.js";
import AlbumModel from "../../models/album.model.js";
import BookModel from "../../models/book.model.js";
import VideoGameModel from "../../models/game.model.js";
import PodcastModel from "../../models/podcast.model.js";
import { createMovieQueue } from "../../services/internal/queueService.js";

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

  const groupId = uuidv4();
  const queueId = uuidv4();
  const testUsername = "testUser";
  const mockMovieQueue = {
    _id: queueId,
    mediaType: "Movie",
    users: [testUsername],
    group: groupId,
    current: [],
    history: [],
    media: "MovieModel",
  };

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
});
