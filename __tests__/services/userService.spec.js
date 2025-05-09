import * as mockingoose from "mockingoose";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../../models/user.model.js";
import { saveUser } from "../../services/internal/userService.js";

describe("User Service", () => {
  beforeEach(() => {
    mockingoose(UserModel).reset();
    jest.clearAllMocks();
  });

  describe("saveUser function", () => {
    beforeEach(() => {
      mockingoose(UserModel).reset();
      jest.clearAllMocks();
    });

    it("should successfully save a valid user and return safe user object", async () => {
      // Arrange
      const mockUser = {
        _id: uuidv4(),
        username: "testuser",
        password: "Password123!",
        dateJoined: new Date(),
      };

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
      const mockUser = {
        _id: uuidv4(),
        username: "testuser",
        password: "Password123!",
        dateJoined: new Date(),
      };

      const failedSaveErrorMessage = {
        error: "Failed to create user",
      };

      mockingoose(UserModel).toReturn(
        new Error("Failed to create user"),
        "$save"
      );

      // Act
      const result = await saveUser(mockUser);

      // Assert
      expect(result).toEqual(failedSaveErrorMessage);
    });
  });
});
