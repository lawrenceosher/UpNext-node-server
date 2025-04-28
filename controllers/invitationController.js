import {
  createInvitation,
  getAllPendingInvitationsForUser,
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

export default function InvitationController(app) {
  const sendNewInvitation = async (req, res) => {
    const { groupId, invitedBy, invitedUser } = req.body;

    try {
      const newInvitation = await createInvitation(
        groupId,
        invitedBy,
        invitedUser
      );

      if ("error" in newInvitation) {
        return res.status(400).json({ error: newInvitation.error });
      }

      // Add the invitation to the invited user's groupInvites
      await addGroupInviteToUser(newInvitation.invitedUser, newInvitation._id);

      if ("error" in newInvitation) {
        return res.status(400).json({
          error: `Error adding group invite to user: ${newInvitation.error}`,
        });
      }

      return res.status(200).json(newInvitation);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error creating invitation: ${error}` });
    }
  };

  const getAllInvitationsByUser = async (req, res) => {
    const { username } = req.params;

    try {
      const invitations = await getAllPendingInvitationsForUser(username);

      if ("error" in invitations) {
        return res.status(400).json({ error: invitations.error });
      }

      return res.status(200).json(invitations);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error fetching invitations: ${error}` });
    }
  };

  const respondToInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const { status } = req.body;

    try {
      const updatedInvitation = await updateInvitationStatus(
        invitationId,
        status
      );

      if ("error" in updatedInvitation) {
        return res.status(400).json({ error: updatedInvitation.error });
      }

      // Remove the invitation from the invited user's groupInvites
      const userUpdateResult = await removeGroupInviteFromUser(
        updatedInvitation.invitedUser,
        invitationId
      );
      if ("error" in userUpdateResult) {
        return res.status(400).json({
          error: `Error removing group invite from user: ${userUpdateResult.error}`,
        });
      }

      // If the invitation is accepted, add the group to the user's groups
      if (status === "accepted") {
        const groupUpdateResult = await addGroupToUser(
          updatedInvitation.invitedUser,
          updatedInvitation.group
        );

        if ("error" in groupUpdateResult) {
          return res.status(400).json({
            error: `Error adding group to user: ${groupUpdateResult.error}`,
          });
        }

        // Add the user to the group's members
        const groupMemberUpdateResult = await addUserToGroup(
          updatedInvitation.group,
          updatedInvitation.invitedUser
        );

        if ("error" in groupMemberUpdateResult) {
          return res.status(400).json({
            error: `Error adding user to group: ${groupMemberUpdateResult.error}`,
          });
        }

        // Add the user to the group's queues
        const queueUpdateResult = await addUserToAllGroupQueues(
          updatedInvitation.invitedUser,
          updatedInvitation.group
        );

        if ("error" in queueUpdateResult) {
          return res.status(400).json({
            error: `Error adding user to group queues: ${queueUpdateResult.error}`,
          });
        }
      }

      // If the invitation is declined, delete the invitation
      if (status === "declined") {
        const deletedInvitation = await deleteInvitation(invitationId);

        if ("error" in deletedInvitation) {
          return res.status(400).json({
            error: `Error deleting invitation: ${deletedInvitation.error}`,
          });
        }
      }

      return res.status(200).json(updatedInvitation);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error updating invitation status: ${error}` });
    }
  };

  const deleteSentInvitation = async (req, res) => {
    const { invitationId } = req.params;

    try {
      const deletedInvitation = await deleteInvitation(invitationId);

      if ("error" in deletedInvitation) {
        return res.status(400).json({ error: deletedInvitation.error });
      }

      // Remove the invitation from the invited user's groupInvites
      const userUpdateResult = await removeGroupInviteFromUser(
        deletedInvitation.invitedUser,
        invitationId
      );
      if ("error" in userUpdateResult) {
        return res.status(400).json({
          error: `Error removing group invite from user: ${userUpdateResult.error}`,
        });
      }

      return res.status(200).json(deletedInvitation);
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error deleting invitation: ${error}` });
    }
  };

  app.post("/api/invitation", sendNewInvitation);
  app.get("/api/invitation/:username", getAllInvitationsByUser);
  app.put("/api/invitation/:invitationId", respondToInvitation);
  app.delete("/api/invitation/:invitationId", deleteSentInvitation);
}
