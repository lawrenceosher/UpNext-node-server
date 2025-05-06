import InvitationModel from "../../models/invitation.model.js";
import { v4 as uuidv4 } from "uuid";
import { isInputStringValid } from "../utils.js";

/**
 * Validates the invitation object to ensure it has the required properties
 * @param groupId - The ID of the group
 * @param invitedBy - The username of the user who sent the invitation
 * @param invitedUser - The username of the user who is invited
 * @returns - True if the invitation object is valid, false otherwise
 */
const isInvitationValid = (groupId, invitedBy, invitedUser) =>
  groupId !== undefined &&
  groupId !== "" &&
  invitedBy !== undefined &&
  invitedBy !== "" &&
  invitedUser !== undefined &&
  invitedUser !== "";

/**
 * Validates the status to ensure it is one of the allowed values
 * @param status - The status to validate
 * @returns - True if the status is valid, false otherwise
 */
const isStatusValid = (status) =>
  status !== undefined && (status === "accepted" || status === "declined");

/**
 * Creates a new invitation
 * @param groupId - The ID of the group
 * @param invitedBy - The username of the user who sent the invitation
 * @param invitedUser - The username of the user who is invited
 * @returns - The created invitation object or an error message
 */
export async function createInvitation(groupId, invitedBy, invitedUser) {
  try {
    // Validate invitation object
    if (!isInvitationValid(groupId, invitedBy, invitedUser)) {
      throw new Error("Invalid invitation properties");
    }

    const newInvitation = {
      _id: uuidv4(),
      group: groupId,
      invitedBy,
      invitedUser,
    };

    // Check if the invitation already exists
    const existingInvitation = await InvitationModel.findOne({
      group: groupId,
      invitedBy,
      invitedUser,
    });

    if (existingInvitation) {
      throw new Error("Invitation already exists");
    }

    // Create the new invitation
    const createdInvitation = await InvitationModel.create(newInvitation);

    if (!createdInvitation) {
      throw new Error("Failed to create invitation");
    }

    return createdInvitation;
  } catch (error) {
    return { error: `Failed to send invitation: ${error.message}` };
  }
}

/**
 * Retrieves all pending invitations for a specific user
 * @param username - The username of the user
 * @returns - An array of invitations or an error message
 */
export async function getAllPendingInvitationsForUser(username) {
  try {
    // Validate username
    if (!isInputStringValid(username)) {
      throw new Error("Invalid username");
    }

    // Find all pending invitations for the user
    const invitations = await InvitationModel.find({
      invitedUser: username,
      status: "pending",
    }).populate("group");

    if (!invitations) {
      throw new Error("No invitations found");
    }

    return invitations;
  } catch (error) {
    return {
      error: `Failed to retrieve pending invitations: ${error.message}`,
    };
  }
}

/**
 * Retrieves all pending invitations for a specific group
 * @param groupId - The ID of the group
 * @returns - An array of invitations or an error message
 */
export async function getAllPendingInvitationsForGroup(groupId) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    // Find all pending invitations for the group
    const invitations = await InvitationModel.find({
      group: groupId,
      status: "pending",
    });

    if (!invitations) {
      throw new Error("No invitations found");
    }

    return invitations;
  } catch (error) {
    return {
      error: `Failed to retrieve pending invitations: ${error.message}`,
    };
  }
}

/**
 * Updates the status of an invitation with one of the following values: accepted, declined
 * @param invitationId - The ID of the invitation
 * @param status - The new status of the invitation
 * @returns - The updated invitation object or an error message
 */
export async function updateInvitationStatus(invitationId, status) {
  try {
    // Validate invitation ID
    if (!isInputStringValid(invitationId)) {
      throw new Error("Invalid invitation ID");
    }

    // Validate status
    if (!isStatusValid(status)) {
      throw new Error("Invalid status");
    }

    const updatedInvitation = await InvitationModel.findOneAndUpdate(
      { _id: invitationId },
      { status },
      {
        new: true,
      }
    );

    if (!updatedInvitation) {
      throw new Error("Invitation not found");
    }

    return updatedInvitation;
  } catch (error) {
    return {
      error: `Failed to update invitation status: ${error.message}`,
    };
  }
}

/**
 * Deletes all invitations for a specific group
 * @param groupId - The ID of the group
 * @returns - The deleted invitations or an error message
 */
export async function deleteInvitationsForGroup(groupId) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    // Delete all invitations for the group
    const deletedInvitations = await InvitationModel.deleteMany({
      group: groupId,
    });

    if (!deletedInvitations) {
      throw new Error("Invitations not found");
    }

    return deletedInvitations;
  } catch (error) {
    return {
      error: `Failed to delete invitations: ${error.message}`,
    };
  }
}

/**
 * Deletes a specific invitation by ID
 * @param invitationId - The ID of the invitation
 * @returns - The deleted invitation or an error message
 */
export async function deleteInvitation(invitationId) {
  try {
    // Validate invitation ID
    if (!isInputStringValid(invitationId)) {
      throw new Error("Invalid invitation ID");
    }

    // Find and delete the invitation by ID
    const deletedInvitation = await InvitationModel.findOneAndDelete({
      _id: invitationId,
    });

    if (!deletedInvitation) {
      throw new Error("Invitation not found");
    }

    return deletedInvitation;
  } catch (error) {
    return {
      error: `Failed to delete invitation: ${error.message}`,
    };
  }
}

/**
 * Deletes all invitations for a specific user in a specific group
 * @param groupId - The ID of the group
 * @param username - The username of the user
 * @returns - The deleted invitations or an error message
 */
export async function deleteInvitationsByUserAndGroup(groupId, username) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    // Validate username
    if (!isInputStringValid(username)) {
      throw new Error("Invalid username");
    }

    // Delete all invitations for the group and user
    const deletedInvitations = await InvitationModel.deleteMany({
      group: groupId,
      invitedUser: username,
    });

    if (!deletedInvitations) {
      throw new Error("Invitations not found");
    }

    return deletedInvitations;
  } catch (error) {
    return {
      error: `Failed to delete invitations: ${error.message}`,
    };
  }
}
