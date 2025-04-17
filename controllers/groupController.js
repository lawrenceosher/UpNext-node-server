import { createGroup } from "../services/internal/groupService.js";
import {
    createMovieQueue,
    createTVQueue,
    createAlbumQueue,
    createBookQueue,
    createVideoGameQueue,
    createPodcastQueue,
  } from "../services/internal/queueService.js";

export default function GroupController(app) {
  const createNewGroup = async (req, res) => {
    const { usernames, groupName } = req.body;
    try {
      const newGroup = await createGroup(usernames, groupName);

      // Create the new queues for the group
      const movieQueueResult = await createMovieQueue(newGroup.users, newGroup._id);
      if ("error" in movieQueueResult) {
        console.log(movieQueueResult.error);
        throw new Error(movieQueueResult.error);
      }
      const tvQueueResult = await createTVQueue(newGroup.users, newGroup._id);
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }
      const albumQueueResult = await createAlbumQueue(newGroup.users, newGroup._id);
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }
      const bookQueueResult = await createBookQueue(newGroup.users, newGroup._id);
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }
      const videoGameQueueResult = await createVideoGameQueue(
        newGroup.users,
        newGroup._id
      );
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }
      const podcastQueueResult = await createPodcastQueue(
        newGroup.users,
        newGroup._id
      );
      if ("error" in podcastQueueResult) {
        throw new Error(podcastQueueResult.error);
      }

      res.status(200).json(newGroup);
    } catch (error) {
      res.status(500).json({ error: "Failed to create group and corresponding queues" });
    }
  };

  app.post("/api/groups", createNewGroup);
}
