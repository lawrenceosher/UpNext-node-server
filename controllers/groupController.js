import {
  createGroup,
  getAllGroupsForUser,
  deleteGroup,
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
import {
  deleteInvitationsForGroup,
  deleteInvitationsByUserAndGroup,
} from "../services/internal/invitationService.js";

/**
 * Handles group-related functionality, including creating, retrieving,
 * updating, and deleting groups, as well as managing group members.
 * @param app - The Express app instance
 */
export default function GroupController(app) {
  /**
   * Validates the request body for creating a new group.
   * @param req - The request object
   * @returns Returns true if the request body is valid, false otherwise
   */
  const isNewGroupBodyValid = (req) =>
    req.body !== undefined &&
    req.body.groupName !== undefined &&
    req.body.groupName !== "" &&
    req.body.creator !== undefined &&
    req.body.creator !== "";

  /**
   * Creates a new group, adds it to the creator's groups, and creates corresponding queues for the group.
   * @param req - The request object containing the group name and creator
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response of the new group or an error message
   */
  const createNewGroup = async (req, res) => {
    // Validate the request body
    if (!isNewGroupBodyValid(req)) {
      res.status(400).send("Invalid request for creating a new group");
      return;
    }

    // Extract groupName and creator from the request body
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
      res.status(500).send(error.message);
    }
  };

  /**
   * Retrieves all groups for a specific user.
   * @param req - The request object containing the username
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response of the groups or an error message
   */
  const retrieveAllGroupsForUser = async (req, res) => {
    const { username } = req.params;

    try {
      const groups = await getAllGroupsForUser(username);

      if ("error" in groups) {
        throw new Error(groups.error);
      }

      res.status(200).json(groups);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Deletes a group by its ID and removes it from all members.
   * @param req - The request object containing the group ID
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response of the deleted group or an error message
   */
  const deleteGroupById = async (req, res) => {
    const { groupId } = req.params;

    try {
      const deletedGroup = await deleteGroup(groupId);

      if ("error" in deletedGroup) {  
        throw new Error(deletedGroup.error);
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
        throw new Error(`Failed to delete associated queues for group ${groupId}`);
      }

      // Delete the invitations associated with the group
      await deleteInvitationsForGroup(deletedGroup._id);

      // Remove the group from all members
      for (const member of deletedGroup.members) {
        const updatedUser = await removeGroupFromUser(member, deletedGroup._id);

        if ("error" in updatedUser) {
          throw new Error(updatedUser.error);
        }
      }

      res.status(200).json(deletedGroup);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Updates a group by its ID.
   * @param req - The request object containing the group ID and updates
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response of the updated group or an error message
   */
  const updateGroupById = async (req, res) => {
    const { groupId } = req.params;

    const groupUpdates = req.body;

    try {
      const updatedGroup = await updateGroup(groupId, groupUpdates);

      if ("error" in updatedGroup) {
        throw new Error(updatedGroup.error)
      }

      res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Removes a member from a group and deletes their invitations.
   * @param req - The request object containing the group ID and username
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response of the updated group or an error message
   */
  const removeGroupMember = async (req, res) => {
    const { groupId } = req.params;
    const { username } = req.body;

    // Validate the request body
    if (!username || username === "") {
      res.status(400).send("Invalid request for removing group member");
      return;
    }

    try {
      const updatedGroup = await leaveGroup(groupId, username);

      if ("error" in updatedGroup) {
        throw new Error(updatedGroup.error);
      }

      // Remove the group from the user's groups
      const updatedUser = await removeGroupFromUser(username, groupId);

      if ("error" in updatedUser) {
        throw new Error(updatedUser.error);
      }

      // Delete the invitations associated with the user in the group
      await deleteInvitationsByUserAndGroup(groupId, username);

      res.status(200).json(updatedGroup);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  // Routes for group-related functionality
  app.post("/api/groups", createNewGroup);
  app.get("/api/groups/:username", retrieveAllGroupsForUser);
  app.delete("/api/groups/:groupId", deleteGroupById);
  app.put("/api/groups/:groupId", updateGroupById);
  app.put("/api/groups/:groupId/remove", removeGroupMember);
}
