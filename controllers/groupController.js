import {
  createGroup,
  getAllGroupsForUser,
  deleteGroup,
  getAllGroups,
  updateGroup,
} from "../services/internal/groupService.js";
import {
  createMovieQueue,
  createTVQueue,
  createAlbumQueue,
  createBookQueue,
  createVideoGameQueue,
  createPodcastQueue,
  deleteQueueByMediaTypeAndGroup,
} from "../services/internal/queueService.js";

export default function GroupController(app) {
  const createNewGroup = async (req, res) => {
    const { users, groupName } = req.body;
    try {
      const newGroup = await createGroup(users, groupName);

      // Create the new queues for the group
      const movieQueueResult = await createMovieQueue(
        [...newGroup.users],
        newGroup._id
      );

      if ("error" in movieQueueResult) {
        throw new Error(movieQueueResult.error);
      }
      const tvQueueResult = await createTVQueue(
        [...newGroup.users],
        newGroup._id
      );
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }
      const albumQueueResult = await createAlbumQueue(
        [...newGroup.users],
        newGroup._id
      );
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }
      const bookQueueResult = await createBookQueue(
        [...newGroup.users],
        newGroup._id
      );
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }
      const videoGameQueueResult = await createVideoGameQueue(
        [...newGroup.users],
        newGroup._id
      );
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }
      const podcastQueueResult = await createPodcastQueue(
        [...newGroup.users],
        newGroup._id
      );
      if ("error" in podcastQueueResult) {
        throw new Error(podcastQueueResult.error);
      }

      res.status(200).json(newGroup);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create group and corresponding queues" });
    }
  };

  const retrieveAllGroupsForUser = async (req, res) => {
    const { username } = req.params;
    const groups = await getAllGroupsForUser(username);
    return res.status(200).json(groups);
  };

  const deleteGroupById = async (req, res) => {
    const { groupId } = req.params;
    try {
      const deletedGroup = await deleteGroup(groupId);
      if (!deletedGroup) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Delete the associated queues
      const deletedMovieQueue = await deleteQueueByMediaTypeAndGroup(
        "Movie",
        deletedGroup._id
      );
      const deletedTVQueue = await deleteQueueByMediaTypeAndGroup(
        "TV",
        deletedGroup._id
      );
      const deletedAlbumQueue = await deleteQueueByMediaTypeAndGroup(
        "Album",
        deletedGroup._id
      );
      const deletedBookQueue = await deleteQueueByMediaTypeAndGroup(
        "Book",
        deletedGroup._id
      );
      const deletedVideoGameQueue = await deleteQueueByMediaTypeAndGroup(
        "VideoGame",
        deletedGroup._id
      );
      const deletedPodcastQueue = await deleteQueueByMediaTypeAndGroup(
        "Podcast",
        deletedGroup._id
      );

      if (
        !deletedMovieQueue ||
        !deletedTVQueue ||
        !deletedAlbumQueue ||
        !deletedBookQueue ||
        !deletedVideoGameQueue ||
        !deletedPodcastQueue
      ) {
        return res
          .status(500)
          .json({ error: "Failed to delete associated queues" });
      }

      return res.status(200).json(deletedGroup);
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete group" });
    }
  };

  const retrieveAllGroups = async (req, res) => {
    const groups = await getAllGroups();
    return res.status(200).json(groups);
  };

  const updateGroupById = async (req, res) => {
    const { groupId } = req.params;
    const groupUpdates = req.body;
    try {
      const updatedGroup = await updateGroup(groupId, groupUpdates);
      if (!updatedGroup) {
        return res.status(404).json({ error: "Group not found" });
      }
      return res.status(200).json(updatedGroup);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update group" });
    }
  };

  app.post("/api/groups", createNewGroup);
  app.get("/api/groups/:username", retrieveAllGroupsForUser);
  app.delete("/api/groups/:groupId", deleteGroupById);
  app.get("/api/groups", retrieveAllGroups);
  app.put("/api/groups/:groupId", updateGroupById);
}
