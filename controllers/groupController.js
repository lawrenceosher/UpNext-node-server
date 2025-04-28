import {
  createGroup,
  getAllGroupsForUser,
  deleteGroup,
  getAllGroups,
  updateGroup,
  leaveGroup,
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
import {
  addGroupToUser,
  removeGroupFromUser,
} from "../services/internal/userService.js";
import { deleteInvitationsForGroup } from "../services/internal/invitationService.js";

export default function GroupController(app) {
  const createNewGroup = async (req, res) => {
    const { groupName, creator } = req.body;
    try {
      const newGroup = await createGroup(groupName, creator);

      // Add the group to the creator's groups
      const updatedUser = await addGroupToUser(creator, newGroup._id);

      if ("error" in updatedUser) {
        throw new Error(updatedUser.error);
      }

      // Create the new queues for the group
      const movieQueueResult = await createMovieQueue(
        [...newGroup.members],
        newGroup._id
      );

      if ("error" in movieQueueResult) {
        throw new Error(movieQueueResult.error);
      }
      const tvQueueResult = await createTVQueue(
        [...newGroup.members],
        newGroup._id
      );
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }
      const albumQueueResult = await createAlbumQueue(
        [...newGroup.members],
        newGroup._id
      );
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }
      const bookQueueResult = await createBookQueue(
        [...newGroup.members],
        newGroup._id
      );
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }
      const videoGameQueueResult = await createVideoGameQueue(
        [...newGroup.members],
        newGroup._id
      );
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }
      const podcastQueueResult = await createPodcastQueue(
        [...newGroup.members],
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

      // Delete the invitations associated with the group
      await deleteInvitationsForGroup(deletedGroup._id);

      // Remove the group from all members
      for (const member of deletedGroup.members) {
        const updatedUser = await removeGroupFromUser(member, deletedGroup._id);
        if ("error" in updatedUser) {
          return res.status(400).json({ error: updatedUser.error });
        }
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

  const removeGroupMember = async (req, res) => {
    const { groupId } = req.params;
    const { username } = req.body;

    try {
      const updatedGroup = await leaveGroup(groupId, username);

      if (!updatedGroup) {
        return res.status(404).json({ error: "Group not found" });
      }

      // Remove the group from the user's groups
      const updatedUser = await removeGroupFromUser(username, groupId);

      if ("error" in updatedUser) {
        return res.status(400).json({ error: updatedUser.error });
      }

      return res.status(200).json(updatedGroup);
    } catch (error) {
      return res.status(500).json({ error: "Failed to remove group member" });
    }
  };

  app.post("/api/groups", createNewGroup);
  app.get("/api/groups/:username", retrieveAllGroupsForUser);
  app.delete("/api/groups/:groupId", deleteGroupById);
  app.get("/api/groups", retrieveAllGroups);
  app.put("/api/groups/:groupId", updateGroupById);
  app.put("/api/groups/:groupId/remove", removeGroupMember);
}
