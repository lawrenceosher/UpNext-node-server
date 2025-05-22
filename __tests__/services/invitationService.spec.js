import { v4 as uuidv4 } from "uuid";
import * as mockingoose from "mockingoose";
import InvitationModel from "../../models/invitation.model.js";
import * as invitationService from "../../services/internal/invitationService.js";

describe("Invitation Service", () => {
  // Mock data
  const groupId = uuidv4();
  const invitationId = uuidv4();
  const invitedBy = "testSender";
  const invitedUser = "testRecipient";

  const mockInvitation = {
    _id: invitationId,
    group: groupId,
    invitedBy,
    invitedUser,
    status: "pending",
  };

  const mockPopulatedInvitation = {
    _id: invitationId,
    group: {
      _id: groupId,
      name: "Test Group",
    },
    invitedBy,
    invitedUser,
    status: "pending",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    mockingoose(InvitationModel).reset();
    jest.clearAllMocks();
  });

  describe("createInvitation", () => {
    it("should create an invitation successfully", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn(null, "findOne");
      mockingoose(InvitationModel).toReturn(mockInvitation, "create");

      // Act
      const result = await invitationService.createInvitation(
        groupId,
        invitedBy,
        invitedUser
      );

      // Assert
      expect(result.group).toBe(mockInvitation.group);
      expect(result.invitedBy).toBe(mockInvitation.invitedBy);
      expect(result.invitedUser).toBe(mockInvitation.invitedUser);
    });

    it("should return error if invitation already exists", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn(mockInvitation, "findOne");

      // Act
      const result = await invitationService.createInvitation(
        groupId,
        invitedBy,
        invitedUser
      );

      // Assert
      expect(result.error).toContain(
        "Failed to send invitation: Invitation already exists"
      );
    });

    it("should return error if invitation properties are invalid", async () => {
      // Arrange
      const invalidGroupId = "";

      // Act
      const result = await invitationService.createInvitation(
        invalidGroupId,
        invitedBy,
        invitedUser
      );

      // Assert
      expect(result.error).toContain(
        "Failed to send invitation: Invalid invitation properties"
      );
    });
  });

  describe("getAllPendingInvitationsForUser", () => {
    it("should return all pending invitations for a user", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn([mockPopulatedInvitation], "find");

      // Act
      const result = await invitationService.getAllPendingInvitationsForUser(
        invitedUser
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].group).toBe(mockPopulatedInvitation.group._id);
    });

    it("should return error if username is invalid", async () => {
      // Arrange
      const invalidUsername = "";

      // Act
      const result = await invitationService.getAllPendingInvitationsForUser(
        invalidUsername
      );

      // Assert
      expect(result.error).toContain(
        "Failed to retrieve pending invitations: Invalid username"
      );
    });
  });

  describe("getAllPendingInvitationsForGroup", () => {
    it("should return all pending invitations for a group", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn([mockInvitation], "find");

      // Act
      const result = await invitationService.getAllPendingInvitationsForGroup(
        groupId
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].group).toBe(groupId);
    });

    it("should return error if groupId is invalid", async () => {
      // Arrange
      const invalidGroupId = "";

      // Act
      const result = await invitationService.getAllPendingInvitationsForGroup(
        invalidGroupId
      );

      // Assert
      expect(result.error).toContain(
        "Failed to retrieve pending invitations: Invalid group ID"
      );
    });
  });

  describe("updateInvitationStatus", () => {
    it("should update invitation status to accepted", async () => {
      // Arrange
      const updatedInvitation = {
        ...mockInvitation,
        status: "accepted",
      };
      mockingoose(InvitationModel).toReturn(
        updatedInvitation,
        "findOneAndUpdate"
      );

      // Act
      const result = await invitationService.updateInvitationStatus(
        invitationId,
        "accepted"
      );

      // Assert
      expect(result.status).toBe("accepted");
    });

    it("should update invitation status to declined", async () => {
      // Arrange
      const updatedInvitation = {
        ...mockInvitation,
        status: "declined",
      };
      mockingoose(InvitationModel).toReturn(
        updatedInvitation,
        "findOneAndUpdate"
      );

      // Act
      const result = await invitationService.updateInvitationStatus(
        invitationId,
        "declined"
      );

      // Assert
      expect(result.status).toBe("declined");
    });

    it("should return error if invitation ID is invalid", async () => {
      // Arrange
      const invalidInvitationId = "";

      // Act
      const result = await invitationService.updateInvitationStatus(
        invalidInvitationId,
        "accepted"
      );

      // Assert
      expect(result.error).toContain(
        "Failed to update invitation status: Invalid invitation ID"
      );
    });

    it("should return error if status is invalid", async () => {
      // Arrange
      const invalidStatus = "invalid";

      // Act
      const result = await invitationService.updateInvitationStatus(
        invitationId,
        invalidStatus
      );

      // Assert
      expect(result.error).toContain(
        "Failed to update invitation status: Invalid status"
      );
    });
  });

  describe("deleteInvitationsForGroup", () => {
    it("should delete all invitations for a group", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn({ deletedCount: 2 }, "deleteMany");

      // Act
      const result = await invitationService.deleteInvitationsForGroup(groupId);

      // Assert
      expect(result.deletedCount).toBe(2);
    });

    it("should return error if groupId is invalid", async () => {
      // Arrange
      const invalidGroupId = "";

      // Act
      const result = await invitationService.deleteInvitationsForGroup(
        invalidGroupId
      );

      // Assert
      expect(result.error).toContain(
        "Failed to delete invitations: Invalid group ID"
      );
    });
  });

  describe("deleteInvitation", () => {
    it("should delete an invitation by ID", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn(mockInvitation, "findOneAndDelete");

      // Act
      const result = await invitationService.deleteInvitation(invitationId);

      // Assert
      expect(result._id).toBe(invitationId);
    });

    it("should return error if invitationId is invalid", async () => {
      // Arrange
      const invalidInvitationId = "";

      // Act
      const result = await invitationService.deleteInvitation(
        invalidInvitationId
      );

      // Assert
      expect(result.error).toContain(
        "Failed to delete invitation: Invalid invitation ID"
      );
    });
  });

  describe("deleteInvitationsByUserAndGroup", () => {
    it("should delete invitations by user and group", async () => {
      // Arrange
      mockingoose(InvitationModel).toReturn({ deletedCount: 1 }, "deleteMany");

      // Act
      const result = await invitationService.deleteInvitationsByUserAndGroup(
        groupId,
        invitedUser
      );

      // Assert
      expect(result.deletedCount).toBe(1);
    });

    it("should return error if groupId is invalid", async () => {
      // Arrange
      const invalidGroupId = "";

      // Act
      const result = await invitationService.deleteInvitationsByUserAndGroup(
        invalidGroupId,
        invitedUser
      );

      // Assert
      expect(result.error).toContain(
        "Failed to delete invitations: Invalid group ID"
      );
    });

    it("should return error if username is invalid", async () => {
      // Arrange
      const invalidUsername = "";

      // Act
      const result = await invitationService.deleteInvitationsByUserAndGroup(
        groupId,
        invalidUsername
      );

      // Assert
      expect(result.error).toContain(
        "Failed to delete invitations: Invalid username"
      );
    });
  });
});
