import * as mockingoose from "mockingoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../../models/user.model.js";
import {
  saveUser,
  findUserByUsername,
  findUserById,
  getUsersList,
  loginUser,
  deleteUserById,
  updateUser,
  addGroupToUser,
  removeGroupFromUser,
  addGroupInviteToUser,
  removeGroupInviteFromUser,
} from "../../services/internal/userService.js";

describe("User Service", () => {
  beforeEach(() => {
    mockingoose(UserModel).reset();
    jest.clearAllMocks();
  });

  const userId = uuidv4();
  const mockUser = {
    _id: userId,
    username: "testuser",
    password: "Password123!",
    dateJoined: new Date(),
    groups: [],
    groupInvites: [],
  };
  const mockUserWithoutPassword = {
    _id: userId,
    username: "testuser",
    dateJoined: new Date(),
    groups: [],
    groupInvites: [],
  };

  describe("saveUser function", () => {
    beforeEach(() => {
      mockingoose(UserModel).reset();
      jest.clearAllMocks();
    });

    it("should successfully save a valid user and return safe user object", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(mockUser, "create");

      // Act
      const result = await saveUser(mockUser);

      // Assert
      expect(result).toHaveProperty("_id", mockUser._id);
      expect(result).toHaveProperty("username", mockUser.username);
      expect(result).toHaveProperty("dateJoined", mockUser.dateJoined);
      expect(result).not.toHaveProperty("password");
    });

    it("should return error when user properties are invalid", async () => {
      // Arrange - different invalid user scenarios
      const invalidUsers = [
        {
          username: "",
          password: "password123",
          _id: uuidv4(),
          dateJoined: new Date(),
        }, // empty username
        {
          username: "testuser",
          password: "",
          _id: uuidv4(),
          dateJoined: new Date(),
        }, // empty password
        {
          username: "testuser",
          password: "password123",
          _id: "",
          dateJoined: new Date(),
        }, // empty _id
        {
          username: "testuser",
          password: "password123",
          _id: uuidv4(),
          dateJoined: "",
        }, // empty dateJoined
        { password: "password123", _id: uuidv4(), dateJoined: new Date() }, // missing username
        { username: "testuser", _id: uuidv4(), dateJoined: new Date() }, // missing password
        {
          username: "testuser",
          password: "password123",
          dateJoined: new Date(),
        }, // missing _id
        { username: "testuser", password: "password123", _id: uuidv4() }, // missing dateJoined
        undefined, // undefined user
      ];

      // Test each invalid user scenario
      for (const invalidUser of invalidUsers) {
        // Act
        const result = await saveUser(invalidUser);

        // Assert
        expect(result).toHaveProperty("error", "Invalid user properties");
      }
    });

    it("should return error when database operation fails", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(
        new Error("Failed to create user"),
        "$save"
      );

      // Act
      const result = await saveUser(mockUser);

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Failed to create user");
    });
  });

  describe("findUserByUsername", () => {
    it("should find and return user by username", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(mockUserWithoutPassword, "findOne");

      // Act
      const result = await findUserByUsername("testuser");

      // Assert
      expect(result.username).toEqual(mockUserWithoutPassword.username);
      expect(result.dateJoined).toEqual(mockUserWithoutPassword.dateJoined);
      expect(result.groups).toEqual(mockUserWithoutPassword.groups);
      expect(result.groupInvites).toEqual(mockUserWithoutPassword.groupInvites);
      expect(result._id).toEqual(mockUserWithoutPassword._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when username is invalid", async () => {
      // Arrange
      const invalidUsernames = ["", undefined];

      // Test each invalid username
      for (const invalidUsername of invalidUsernames) {
        // Act
        const result = await findUserByUsername(invalidUsername);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Cannot find user with empty username");
      }
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOne");

      // Act
      const result = await findUserByUsername("testuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when finding user");
    });

    it("should return null when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOne");

      // Act
      const result = await findUserByUsername("nonexistentuser");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("User not found");
    });
  });

  describe("findUserById", () => {
    it("should find and return user by ID", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(mockUserWithoutPassword, "findOne");

      // Act
      const result = await findUserById(userId);

      // Assert
      expect(result.username).toEqual(mockUserWithoutPassword.username);
      expect(result.dateJoined).toEqual(mockUserWithoutPassword.dateJoined);
      expect(result.groups).toEqual(mockUserWithoutPassword.groups);
      expect(result.groupInvites).toEqual(mockUserWithoutPassword.groupInvites);
      expect(result._id).toEqual(mockUserWithoutPassword._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when ID is invalid", async () => {
      // Arrange - invalid IDs
      const invalidIds = ["", undefined];

      // Test each invalid ID
      for (const invalidId of invalidIds) {
        // Act
        const result = await findUserById(invalidId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Cannot find user with empty ID");
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOne");

      // Act
      const result = await findUserById("nonexistentid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("User not found");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOne");

      // Act
      const result = await findUserById("validid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when finding user");
    });
  });

  describe("getUsersList", () => {
    it("should return a list of all users", async () => {
      // Arrange
      const mockUsers = [
        mockUserWithoutPassword,
        {
          _id: uuidv4(),
          username: "user2",
          dateJoined: new Date(),
          groups: [],
          groupInvites: [],
        },
      ];
      mockingoose(UserModel).toReturn(mockUsers, "find");

      // Act
      const result = await getUsersList();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(result[0].password).toBeUndefined();
      expect(result[1].password).toBeUndefined();
    });

    it("should return error when users cannot be retrieved", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "find");

      // Act
      const result = await getUsersList();

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Users could not be retrieved");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "find");

      // Act
      const result = await getUsersList();

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when finding users");
    });
  });

  describe("loginUser", () => {
    it("should authenticate valid credentials and return user object", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(mockUser, "findOne");

      // Act
      const result = await loginUser({
        username: "testuser",
        password: "Password123!",
      });

      // Assert
      expect(result.username).toEqual(mockUser.username);
      expect(result.dateJoined).toEqual(mockUser.dateJoined);
      expect(result.groups).toEqual(mockUser.groups);
      expect(result.groupInvites).toEqual(mockUser.groupInvites);
      expect(result._id).toEqual(mockUser._id);
    });

    it("should return error for invalid credentials", async () => {
      // Arrange - various invalid credential scenarios
      const invalidCredentials = [
        { username: "", password: "password" },
        { username: "user", password: "" },
        { password: "password" }, // missing username
        { username: "user" }, // missing password
      ];

      // Test each invalid credential scenario
      for (const invalidCred of invalidCredentials) {
        // Act
        const result = await loginUser(invalidCred);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Empty login credentials");
      }
    });

    it("should return authentication error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOne");

      // Act
      const result = await loginUser({
        username: "nonexistentuser",
        password: "invalidpassword",
      });

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Authentication failed");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOne");

      // Act
      const result = await loginUser({
        username: "testuser",
        password: "validpassword",
      });

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when authenticating user");
    });
  });

  describe("deleteUserById", () => {
    it("should delete and return the deleted user", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(
        mockUserWithoutPassword,
        "findOneAndDelete"
      );

      // Act
      const result = await deleteUserById(userId);

      // Assert
      expect(result.username).toEqual(mockUserWithoutPassword.username);
      expect(result.dateJoined).toEqual(mockUserWithoutPassword.dateJoined);
      expect(result.groups).toEqual(mockUserWithoutPassword.groups);
      expect(result.groupInvites).toEqual(mockUserWithoutPassword.groupInvites);
      expect(result._id).toEqual(mockUserWithoutPassword._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when ID is invalid", async () => {
      // Arrange - invalid IDs
      const invalidIds = ["", undefined];

      // Test each invalid ID
      for (const invalidId of invalidIds) {
        // Act
        const result = await deleteUserById(invalidId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Cannot delete user with empty ID");
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndDelete");

      // Act
      const result = await deleteUserById("nonexistentid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error deleting user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndDelete");

      // Act
      const result = await deleteUserById("validid");

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when deleting user");
    });
  });

  describe("updateUser", () => {
    it("should update and return the updated user", async () => {
      // Arrange
      const updatedMockUser = {
        ...mockUserWithoutPassword,
        password: "newPass",
      };
      mockingoose(UserModel).toReturn(updatedMockUser, "findOneAndUpdate");

      // Act
      const result = await updateUser(userId, { password: "newPass" });

      // Assert
      expect(result.username).toEqual(updatedMockUser.username);
      expect(result.password).toEqual("newPass");
      expect(result.dateJoined).toEqual(updatedMockUser.dateJoined);
      expect(result.groups).toEqual(updatedMockUser.groups);
      expect(result.groupInvites).toEqual(updatedMockUser.groupInvites);
      expect(result._id).toEqual(updatedMockUser._id);
    });

    it("should return error when ID is invalid", async () => {
      // Arrange - invalid IDs
      const invalidIds = ["", undefined];
      const updates = { username: "updateduser" };

      // Test each invalid ID
      for (const invalidId of invalidIds) {
        // Act
        const result = await updateUser(invalidId, updates);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain("Cannot update user with empty ID");
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await updateUser("nonexistentid", {
        username: "updateduser",
      });

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error updating user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await updateUser("validid", { username: "updateduser" });

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error occurred when updating user");
    });
  });

  describe("addGroupToUser", () => {
    it("should add group to user and return updated user", async () => {
      // Arrange
      const username = "testuser";
      const groupId = uuidv4();
      const mockUserGroup = {
        ...mockUserWithoutPassword,
        groups: [groupId],
      };
      mockingoose(UserModel).toReturn(mockUserGroup, "findOneAndUpdate");

      // Act
      const result = await addGroupToUser(username, groupId);

      // Assert
      expect(result.username).toEqual(mockUserGroup.username);
      expect(result.dateJoined).toEqual(mockUserGroup.dateJoined);
      expect(result.groups).toEqual(mockUserGroup.groups);
      expect(result.groupInvites).toEqual(mockUserGroup.groupInvites);
      expect(result._id).toEqual(mockUserGroup._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when username is invalid", async () => {
      // Arrange - invalid usernames
      const invalidUsernames = ["", undefined];
      const validGroupId = uuidv4();

      // Test each invalid username
      for (const invalidUsername of invalidUsernames) {
        // Act
        const result = await addGroupToUser(invalidUsername, validGroupId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group to user with empty username"
        );
      }
    });

    it("should return error when group ID is invalid", async () => {
      // Arrange - invalid group IDs
      const validUsername = "testuser";
      const invalidGroupIds = ["", undefined];

      // Test each invalid group ID
      for (const invalidGroupId of invalidGroupIds) {
        // Act
        const result = await addGroupToUser(validUsername, invalidGroupId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group to user with empty group ID"
        );
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await addGroupToUser("nonexistentuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error adding group to user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await addGroupToUser("testuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain(
        "Error occurred when adding group to user"
      );
    });
  });

  describe("removeGroupFromUser", () => {
    it("should remove group from user and return updated user", async () => {
      // Arrange
      const username = "testuser";
      const validGroupId = uuidv4();
      mockingoose(UserModel).toReturn(
        mockUserWithoutPassword,
        "findOneAndUpdate"
      );

      // Act
      const result = await removeGroupFromUser(username, validGroupId);

      // Assert
      expect(result.username).toEqual(mockUserWithoutPassword.username);
      expect(result.dateJoined).toEqual(mockUserWithoutPassword.dateJoined);
      expect(result.groups).toEqual(mockUserWithoutPassword.groups);
      expect(result.groupInvites).toEqual(mockUserWithoutPassword.groupInvites);
      expect(result._id).toEqual(mockUserWithoutPassword._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when username is invalid", async () => {
      // Arrange - invalid usernames
      const invalidUsernames = ["", undefined];
      const validGroupId = uuidv4();

      // Test each invalid username
      for (const invalidUsername of invalidUsernames) {
        // Act
        const result = await removeGroupFromUser(invalidUsername, validGroupId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group to user with empty username"
        );
      }
    });

    it("should return error when group ID is invalid", async () => {
      // Arrange - invalid group IDs
      const validUsername = "testuser";
      const invalidGroupIds = ["", undefined];

      // Test each invalid group ID
      for (const invalidGroupId of invalidGroupIds) {
        // Act
        const result = await removeGroupFromUser(validUsername, invalidGroupId);

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group to user with empty group ID"
        );
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await removeGroupFromUser("nonexistentuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error removing group from user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await removeGroupFromUser("testuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain(
        "Error occurred when removing group from user"
      );
    });
  });

  describe("addGroupInviteToUser", () => {
    it("should add group invite to user and return updated user", async () => {
      // Arrange
      const username = "testuser";
      const inviteId = uuidv4();
      const mockUserGroupInvites = {
        ...mockUserWithoutPassword,
        groupInvites: [inviteId],
      };
      mockingoose(UserModel).toReturn(mockUserGroupInvites, "findOneAndUpdate");

      // Act
      const result = await addGroupInviteToUser(username, inviteId);

      // Assert
      expect(result.username).toEqual(mockUserGroupInvites.username);
      expect(result.dateJoined).toEqual(mockUserGroupInvites.dateJoined);
      expect(result.groups).toEqual(mockUserGroupInvites.groups);
      expect(result.groupInvites).toEqual(mockUserGroupInvites.groupInvites);
      expect(result._id).toEqual(mockUserGroupInvites._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when username is invalid", async () => {
      // Arrange - invalid usernames
      const invalidUsernames = ["", undefined];
      const validInviteId = uuidv4();

      // Test each invalid username
      for (const invalidUsername of invalidUsernames) {
        // Act
        const result = await addGroupInviteToUser(
          invalidUsername,
          validInviteId
        );

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group invite to user with empty username"
        );
      }
    });

    it("should return error when invite ID is invalid", async () => {
      // Arrange - invalid invite IDs
      const validUsername = "testuser";
      const invalidInviteIds = ["", undefined];

      // Test each invalid invite ID
      for (const invalidInviteId of invalidInviteIds) {
        // Act
        const result = await addGroupInviteToUser(
          validUsername,
          invalidInviteId
        );

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot add group invite to user with empty group invite ID"
        );
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await addGroupInviteToUser("nonexistentuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error adding group invite to user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await addGroupInviteToUser("testuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain(
        "Error occurred when adding group invite to user"
      );
    });
  });

  describe("removeGroupInviteFromUser", () => {
    it("should remove group invite from user and return updated user", async () => {
      // Arrange
      const username = "testuser";
      mockingoose(UserModel).toReturn(
        mockUserWithoutPassword,
        "findOneAndUpdate"
      );

      // Act
      const result = await removeGroupInviteFromUser(username, uuidv4());

      // Assert
      expect(result.username).toEqual(mockUserWithoutPassword.username);
      expect(result.dateJoined).toEqual(mockUserWithoutPassword.dateJoined);
      expect(result.groups).toEqual(mockUserWithoutPassword.groups);
      expect(result.groupInvites).toEqual(mockUserWithoutPassword.groupInvites);
      expect(result._id).toEqual(mockUserWithoutPassword._id);
      expect(result.password).toBeUndefined();
    });

    it("should return error when username is invalid", async () => {
      // Arrange - invalid usernames
      const invalidUsernames = ["", undefined];
      const validInviteId = uuidv4();

      // Test each invalid username
      for (const invalidUsername of invalidUsernames) {
        // Act
        const result = await removeGroupInviteFromUser(
          invalidUsername,
          validInviteId
        );

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot remove group invite from user with empty username"
        );
      }
    });

    it("should return error when invite ID is invalid", async () => {
      // Arrange - invalid invite IDs
      const validUsername = "testuser";
      const invalidInviteIds = ["", undefined];

      // Test each invalid invite ID
      for (const invalidInviteId of invalidInviteIds) {
        // Act
        const result = await removeGroupInviteFromUser(
          validUsername,
          invalidInviteId
        );

        // Assert
        expect(result).toHaveProperty("error");
        expect(result.error).toContain(
          "Cannot remove group invite from user with empty group invite ID"
        );
      }
    });

    it("should return error when user is not found", async () => {
      // Arrange
      mockingoose(UserModel).toReturn(null, "findOneAndUpdate");

      // Act
      const result = await removeGroupInviteFromUser(
        "nonexistentuser",
        uuidv4()
      );

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain("Error removing group invite from user");
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockingoose(UserModel).toReturn(dbError, "findOneAndUpdate");

      // Act
      const result = await removeGroupInviteFromUser("testuser", uuidv4());

      // Assert
      expect(result).toHaveProperty("error");
      expect(result.error).toContain(
        "Error occurred when removing group invite from user"
      );
    });
  });
});
