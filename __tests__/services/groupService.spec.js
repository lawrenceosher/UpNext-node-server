import * as mockingoose from "mockingoose";
import { v4 as uuidv4 } from "uuid";
import GroupModel from "../../models/group.model.js";
import {
  createGroup,
  getAllGroups,
  getAllGroupsForUser,
  getGroupById,
  updateGroup,
  deleteGroup,
  leaveGroup,
  addUserToGroup,
} from "../../services/internal/groupService.js";

describe("Group Service", () => {
  beforeEach(() => {
    mockingoose(GroupModel).reset();
    jest.clearAllMocks();
  });

  const groupId = uuidv4();
  const mockGroup = {
    _id: groupId,
    name: "Test Group",
    creator: "testuser",
    members: ["testuser"],
  };

  describe("createGroup", () => {
    it("should successfully create a group with valid inputs", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(mockGroup, "create");

      // Act
      const result = await createGroup("Test Group", "testuser");

      // Assert
      expect(result).toHaveProperty("_id");
      expect(result.name).toBe("Test Group");
      expect(result.creator).toBe("testuser");
      expect(result.members).toContain("testuser");
    });

    it("should return error for invalid creator username", async () => {
      // Arrange
      const invalidUsernames = ["", undefined, null];

      // Act & Assert
      for (const invalidUsername of invalidUsernames) {
        const result = await createGroup("Test Group", invalidUsername);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid creator username");
      }
    });

    it("should return error for invalid group name", async () => {
      // Arrange
      const invalidNames = ["", undefined, null];

      // Act & Assert
      for (const invalidName of invalidNames) {
        const result = await createGroup(invalidName, "testuser");
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group name");
      }
    });

    it("should handle database errors when creating group", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(
        new Error("Failed to create group"),
        "$save"
      );

      // Act
      const result = await createGroup("Test Group", "testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to create group");
    });
  });

  describe("getAllGroups", () => {
    it("should return all groups", async () => {
      // Arrange
      const mockGroups = [
        {
          _id: uuidv4(),
          name: "Group 1",
          creator: "user1",
          members: ["user1"],
        },
        {
          _id: uuidv4(),
          name: "Group 2",
          creator: "user2",
          members: ["user2"],
        },
      ];
      mockingoose(GroupModel).toReturn(mockGroups, "find");

      // Act
      const result = await getAllGroups();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty("name", "Group 1");
      expect(result[1]).toHaveProperty("name", "Group 2");
    });

    it("should return error when no groups exist", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn([], "find");

      // Act
      const result = await getAllGroups();

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("No groups found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "find");

      // Act
      const result = await getAllGroups();

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to get groups");
    });
  });

  describe("getAllGroupsForUser", () => {
    it("should return all groups for a specific user", async () => {
      // Arrange
      const username = "testuser";
      const mockGroups = [
        {
          _id: uuidv4(),
          name: "Group 1",
          creator: username,
          members: [username],
        },
        {
          _id: uuidv4(),
          name: "Group 2",
          creator: "other",
          members: [username, "other"],
        },
      ];
      mockingoose(GroupModel).toReturn(mockGroups, "find");

      // Act
      const result = await getAllGroupsForUser(username);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].members).toContain(username);
      expect(result[1].members).toContain(username);
    });

    it("should return error for invalid username", async () => {
      // Arrange
      const invalidUsernames = ["", undefined, null];

      // Act & Assert
      for (const invalidUsername of invalidUsernames) {
        const result = await getAllGroupsForUser(invalidUsername);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid username");
      }
    });

    it("should return error when user has no groups", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn([], "find");

      // Act
      const result = await getAllGroupsForUser("userWithNoGroups");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("No groups found for user");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "find");

      // Act
      const result = await getAllGroupsForUser("testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to get groups");
    });
  });

  describe("getGroupById", () => {
    it("should return a group by its ID", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn([mockGroup], "find");

      // Act
      const result = await getGroupById(groupId);

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty("_id", groupId);
      expect(result[0]).toHaveProperty("name", "Test Group");
    });

    it("should return error for invalid group ID", async () => {
      // Arrange
      const invalidIds = ["", undefined, null];

      // Act & Assert
      for (const invalidId of invalidIds) {
        const result = await getGroupById(invalidId);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group ID");
      }
    });

    it("should return error when group is not found", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(null, "find");

      // Act
      const result = await getGroupById("nonexistentid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Group not found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "find");

      // Act
      const result = await getGroupById(groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to get group");
    });
  });

  describe("updateGroup", () => {
    it("should update a group and return the updated group", async () => {
      // Arrange
      const updates = { name: "Updated Group Name" };
      const updatedGroup = { ...mockGroup, ...updates };
      mockingoose(GroupModel).toReturn(updatedGroup, "findOneAndUpdate");

      // Act
      const result = await updateGroup(groupId, updates);

      // Assert
      expect(result).toHaveProperty("_id", groupId);
      expect(result).toHaveProperty("name", "Updated Group Name");
    });

    it("should return error for invalid group ID", async () => {
      // Arrange
      const invalidIds = ["", undefined, null];
      const updates = { name: "Updated Group Name" };

      // Act & Assert
      for (const invalidId of invalidIds) {
        const result = await updateGroup(invalidId, updates);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group ID");
      }
    });

    it("should return error when group is not found", async () => {
      // Arrange
      const updates = { name: "Updated Group Name" };
      mockingoose(GroupModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await updateGroup("nonexistentid", updates);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Group not found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const updates = { name: "Updated Group Name" };
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await updateGroup(groupId, updates);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to update group");
    });
  });

  describe("deleteGroup", () => {
    it("should delete a group and return the deleted group", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(mockGroup, "findOneAndDelete");

      // Act
      const result = await deleteGroup(groupId);

      // Assert
      expect(result).toHaveProperty("_id", groupId);
      expect(result).toHaveProperty("name", "Test Group");
    });

    it("should return error for invalid group ID", async () => {
      // Arrange
      const invalidIds = ["", undefined, null];

      // Act & Assert
      for (const invalidId of invalidIds) {
        const result = await deleteGroup(invalidId);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group ID");
      }
    });

    it("should return error when group is not found", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(null, "findOneAndDelete");

      // Act
      const result = await deleteGroup("nonexistentid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Group not found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "findOneAndDelete");

      // Act
      const result = await deleteGroup(groupId);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to delete group");
    });
  });

  describe("leaveGroup", () => {
    it("should remove a user from a group and return the updated group", async () => {
      // Arrange
      const username = "testuser";
      const updatedGroup = { ...mockGroup, members: [] };
      mockingoose(GroupModel).toReturn(updatedGroup, "findOneAndUpdate");

      // Act
      const result = await leaveGroup(groupId, username);

      // Assert
      expect(result).toHaveProperty("_id", groupId);
      expect(result.members).not.toContain(username);
    });

    it("should return error for invalid group ID", async () => {
      // Arrange
      const invalidIds = ["", undefined, null];

      // Act & Assert
      for (const invalidId of invalidIds) {
        const result = await leaveGroup(invalidId, "testuser");
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group ID");
      }
    });

    it("should return error for invalid username", async () => {
      // Arrange
      const invalidUsernames = ["", undefined, null];

      // Act & Assert
      for (const invalidUsername of invalidUsernames) {
        const result = await leaveGroup(groupId, invalidUsername);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid username");
      }
    });

    it("should return error when group is not found", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await leaveGroup("nonexistentid", "testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Group not found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await leaveGroup(groupId, "testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to leave/remove from group");
    });
  });

  describe("addUserToGroup", () => {
    it("should add a user to a group and return the updated group", async () => {
      // Arrange
      const username = "newuser";
      const updatedGroup = {
        ...mockGroup,
        members: [...mockGroup.members, username],
      };
      mockingoose(GroupModel).toReturn(updatedGroup, "findOneAndUpdate");

      // Act
      const result = await addUserToGroup(groupId, username);

      // Assert
      expect(result).toHaveProperty("_id", groupId);
      expect(result.members).toContain(username);
    });

    it("should return error for invalid group ID", async () => {
      // Arrange
      const invalidIds = ["", undefined, null];

      // Act & Assert
      for (const invalidId of invalidIds) {
        const result = await addUserToGroup(invalidId, "testuser");
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid group ID");
      }
    });

    it("should return error for invalid username", async () => {
      // Arrange
      const invalidUsernames = ["", undefined, null];

      // Act & Assert
      for (const invalidUsername of invalidUsernames) {
        const result = await addUserToGroup(groupId, invalidUsername);
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Invalid username");
      }
    });

    it("should return error when group is not found", async () => {
      // Arrange
      mockingoose(GroupModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await addUserToGroup("nonexistentid", "testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Group not found");
    });

    it("should handle database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(GroupModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await addUserToGroup(groupId, "testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to add user to group");
    });
  });
});
