import InvitationModel from "../../models/invitation.model.js";
import { v4 as uuidv4 } from "uuid";

export async function createInvitation(groupId, invitedBy, invitedUser) {
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
    return { error: "Invitation already exists" };
  }

  // Create the new invitation
  return await InvitationModel.create(newInvitation);
}

export async function getAllPendingInvitationsForUser(username) {
  const invitations = await InvitationModel.find({
    invitedUser: username,
    status: "pending",
  }).populate("group");
  return invitations;
}

export async function getAllPendingInvitationsForGroup(groupId) {
  const invitations = await InvitationModel.find({
    group: groupId,
    status: "pending",
  });
  return invitations;
}

export async function updateInvitationStatus(invitationId, status) {
  const updatedInvitation = await InvitationModel.findOneAndUpdate(
    { _id: invitationId },
    { status },
    {
      new: true,
    }
  );
  return updatedInvitation;
}

export async function deleteInvitationsForGroup(groupId) {
  const deletedInvitations = await InvitationModel.deleteMany({
    group: groupId,
  });
  return deletedInvitations;
}

export async function deleteInvitation(invitationId) {
  const deletedInvitation = await InvitationModel.findOneAndDelete({
    _id: invitationId,
  });
  return deletedInvitation;
}

export async function deleteInvitationsByUserAndGroup(groupId, username) {
  const deletedInvitation = await InvitationModel.deleteMany({
    group: groupId,
    invitedUser: username,
  });
  return deletedInvitation;
}
