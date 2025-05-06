import {
  createInvitation,
  getAllPendingInvitationsForUser,
  getAllPendingInvitationsForGroup,
  updateInvitationStatus,
  deleteInvitation,
} from "../services/internal/invitationService.js";
import {
  addGroupInviteToUser,
  removeGroupInviteFromUser,
  addGroupToUser,
} from "../services/internal/userService.js";
import { addUserToGroup } from "../services/internal/groupService.js";
import { addUserToAllGroupQueues } from "../services/internal/queueService.js";

/**
 * Handles invitation-related operations such as sending, retrieving, responding to, and deleting invitations.
 * @param app - The Express app instance
 */
export default function InvitationController(app) {
  /**
   * Validates the invitation request to make sure it has valid groupId, invitedBy, and invitedUser.
   * @param req - The request object
   * @returns Returns true if the request is valid, false otherwise
   */
  const isInvitationValid = (req) =>
    req.body !== undefined &&
    req.body.groupId !== undefined &&
    req.body.groupId !== "" &&
    req.body.invitedBy !== undefined &&
    req.body.invitedBy !== "" &&
    req.body.invitedUser !== undefined &&
    req.body.invitedUser !== "";

  /**
   * Validates the status to ensure it is one of the allowed values.
   * @param status - The status to validate
   * @returns Returns true if the status is valid, false otherwise
   */
  const isStatusValid = (status) =>
    status !== undefined && (status === "accepted" || status === "declined");

  /**
   * Sends a new invitation to a user to join a group.
   * @param req - The request object containing groupId, invitedBy, and invitedUser
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response containing the new invitation or 500 (error) with an error message
   */
  const sendNewInvitation = async (req, res) => {
    // Validate the request
    if (!isInvitationValid(req)) {
      res.status(400).json("Invalid invitation");
      return;
    }

    // Extract the groupId, invitedBy, and invitedUser from the request body
    const { groupId, invitedBy, invitedUser } = req.body;

    try {
      const newInvitation = await createInvitation(
        groupId,
        invitedBy,
        invitedUser
      );

      if ("error" in newInvitation) {
        throw new Error(newInvitation.error);
      }

      // Add the invitation to the invited user's groupInvites
      const invite = await addGroupInviteToUser(
        newInvitation.invitedUser,
        newInvitation._id
      );

      if ("error" in invite) {
        throw new Error(invite.error);
      }

      res.status(200).json(newInvitation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Retrieves all pending invitations for a user.
   * @param req - The request object containing the username
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response containing the invitations or 500 (error) with an error message
   */
  const getAllInvitationsByUser = async (req, res) => {
    const { username } = req.params;

    try {
      const invitations = await getAllPendingInvitationsForUser(username);

      if ("error" in invitations) {
        throw new Error(invitations.error);
      }

      res.status(200).json(invitations);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Retrieves all pending invitations for a group.
   * @param req - The request object containing the groupId
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response containing the invitations or 500 (error) with an error message
   */
  const getAllInvitationsByGroup = async (req, res) => {
    const { groupId } = req.params;

    try {
      const invitations = await getAllPendingInvitationsForGroup(groupId);

      if ("error" in invitations) {
        throw new Error(invitations.error);
      }

      res.status(200).json(invitations);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Responds to an invitation by updating its status and performing necessary actions based on the status.
   * @param req - The request object containing the invitationId and status
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response containing the updated invitation or 500 (error) with an error message
   */
  const respondToInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const { status } = req.body;

    // Validate the status
    if (!isStatusValid(status)) {
      res.status(400).json("Invalid status");
      return;
    }

    try {
      const updatedInvitation = await updateInvitationStatus(
        invitationId,
        status
      );

      if ("error" in updatedInvitation) {
        throw new Error(updatedInvitation.error);
      }

      // Remove the invitation from the invited user's groupInvites
      const userUpdateResult = await removeGroupInviteFromUser(
        updatedInvitation.invitedUser,
        invitationId
      );

      if ("error" in userUpdateResult) {
        throw new Error(userUpdateResult.error);
      }

      // If the invitation is accepted, add the group to the user's groups
      if (status === "accepted") {
        const groupUpdateResult = await addGroupToUser(
          updatedInvitation.invitedUser,
          updatedInvitation.group
        );

        if ("error" in groupUpdateResult) {
          throw new Error(groupUpdateResult.error);
        }

        // Add the user to the group's members
        const groupMemberUpdateResult = await addUserToGroup(
          updatedInvitation.group,
          updatedInvitation.invitedUser
        );

        if ("error" in groupMemberUpdateResult) {
          throw new Error(groupMemberUpdateResult.error);
        }

        // Add the user to the group's queues
        const queueUpdateResult = await addUserToAllGroupQueues(
          updatedInvitation.invitedUser,
          updatedInvitation.group
        );

        if ("error" in queueUpdateResult) {
          throw new Error(queueUpdateResult.error);
        }
      }

      // If the invitation is declined, delete the invitation
      if (status === "declined") {
        const deletedInvitation = await deleteInvitation(invitationId);

        if ("error" in deletedInvitation) {
          throw new Error(deletedInvitation.error);
        }
      }

      res.status(200).json(updatedInvitation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  /**
   * Deletes a sent invitation and removes it from the invited user's groupInvites.
   * @param req - The request object containing the invitationId
   * @param res - The response object
   * @returns Either 200 (success) with a JSON response containing the deleted invitation or 500 (error) with an error message
   */
  const deleteSentInvitation = async (req, res) => {
    const { invitationId } = req.params;

    try {
      const deletedInvitation = await deleteInvitation(invitationId);

      if ("error" in deletedInvitation) {
        throw new Error(deletedInvitation.error);
      }

      // Remove the invitation from the invited user's groupInvites
      const userUpdateResult = await removeGroupInviteFromUser(
        deletedInvitation.invitedUser,
        invitationId
      );

      if ("error" in userUpdateResult) {
        throw new Error(userUpdateResult.error);
      }

      res.status(200).json(deletedInvitation);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  // Routes for invitation-related operations
  app.post("/api/invitation", sendNewInvitation);
  app.get("/api/invitation/:username", getAllInvitationsByUser);
  app.get("/api/invitation/group/:groupId", getAllInvitationsByGroup);
  app.put("/api/invitation/:invitationId", respondToInvitation);
  app.delete("/api/invitation/:invitationId", deleteSentInvitation);
}
