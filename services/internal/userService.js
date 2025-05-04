import UserModel from "../../models/user.model.js";

/**
 * Validates the user object to ensure it has the required properties
 * @param user - The user object to validate
 * @returns - True if the user object is valid, false otherwise
 */
const isUserValid = (user) =>
  user !== undefined &&
  user.username !== undefined &&
  user.username !== "" &&
  user.password !== undefined &&
  user.password !== "" &&
  user.dateJoined !== undefined &&
  user.dateJoined !== "" &&
  user._id !== undefined &&
  user._id !== "";

/**
 * Validates the username to ensure it is not undefined or empty
 * @param username - The username to validate
 * @returns - True if the username is valid, false otherwise
 */
const isUsernameValid = (username) => username !== undefined && username !== "";

/**
 * Validates the ID to ensure it is not undefined or empty
 * @param Id - The ID to validate
 * @returns - True if the ID is valid, false otherwise
 */
const isIdValid = (Id) => Id !== undefined && Id !== "";

/**
 * Validates the login credentials to ensure they are not undefined or empty
 * @param credentials - The login credentials to validate
 * @returns - True if the credentials are valid, false otherwise
 */
const areCredentialsValid = (credentials) =>
  credentials !== undefined &&
  credentials.username !== undefined &&
  credentials.username !== "" &&
  credentials.password !== undefined &&
  credentials.password !== "";

/**
 * Saves a new user to the database
 * @param user - The user object to save
 * @returns - The saved user object or an error message
 */
export const saveUser = async (user) => {
  try {
    // Validate user object
    if (!isUserValid(user)) {
      throw Error("Invalid user properties");
    }

    // Create new user
    const result = await UserModel.create(user);

    if (!result) {
      throw Error("Failed to create user");
    }

    // Remove password field from returned object
    const safeUser = {
      _id: result._id,
      username: result.username,
      dateJoined: result.dateJoined,
    };

    return safeUser;
  } catch (error) {
    return { error: error.message };
  }
};

/**
 * Finds a user by username
 * @param username - The username of the user to find
 * @returns - The found user or an error message
 */
export const findUserByUsername = async (username) => {
  try {
    // Validate username
    if (!isUsernameValid(username)) {
      throw Error("Cannot find user with empty username");
    }

    // Find user by username
    const user = await UserModel.findOne({ username: username }).select(
      "-password"
    );

    return user;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Finds a user by ID
 * @param id - The ID of the user to find
 * @returns - The found user or an error message
 */
export const findUserById = async (id) => {
  try {
    // Validate user ID
    if (!isIdValid(id)) {
      throw Error("Cannot find user with empty ID");
    }

    // Find user by ID
    const user = await UserModel.findOne({ _id: id }).select("-password");

    if (!user) {
      throw Error("User not found");
    }

    return user;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

/**
 * Retrieves a list of all users
 * @returns - An array of users or an error message
 */
export const getUsersList = async () => {
  try {
    // Find all users
    const users = await UserModel.find().select("-password");

    if (!users) {
      throw Error("Users could not be retrieved");
    }

    return users;
  } catch (error) {
    return { error: `Error occurred when finding users: ${error}` };
  }
};

export const loginUser = async (loginCredentials) => {
  const { username, password } = loginCredentials;

  try {
    // Validate login credentials
    if (!areCredentialsValid(loginCredentials)) {
      throw Error("Empty login credentials");
    }

    // Find user by username and password
    const user = await UserModel.findOne({ username, password }).select(
      "-password"
    );

    if (!user) {
      throw Error("Authentication failed");
    }

    return user;
  } catch (error) {
    return { error: `Error occurred when authenticating user: ${error}` };
  }
};

/**
 * Deletes a user by ID
 * @param id - The ID of the user to delete
 * @returns - The deleted user or an error message
 */
export const deleteUserById = async (id) => {
  try {
    // Validate user ID
    if (!isIdValid(id)) {
      throw Error("Cannot delete user with empty ID");
    }

    // Find and delete user by ID
    const deletedUser = await UserModel.findOneAndDelete({
      _id: id,
    }).select("-password");

    if (!deletedUser) {
      throw Error("Error deleting user");
    }

    return deletedUser;
  } catch (error) {
    return { error: `Error occurred when deleting user: ${error}` };
  }
};

/**
 * Updates a user by ID
 * @param id - The ID of the user to update
 * @param updates - The updates to apply to the user
 * @returns - The updated user or an error message
 */
export const updateUser = async (id, updates) => {
  try {
    // Validate user ID
    if (!isIdValid(id)) {
      throw Error("Cannot update user with empty ID");
    }

    // Update user by ID with new values
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw Error("Error updating user");
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error occurred when updating user: ${error}` };
  }
};

/**
 * Adds a group to a user's list of groups
 * @param username - The username of the user
 * @param groupId - The ID of the group to add
 * @returns - The updated user or an error message
 */
export const addGroupToUser = async (username, groupId) => {
  try {
    // Validate username
    if (!isUsernameValid(username)) {
      throw Error("Cannot add group to user with empty username");
    }
    // Validate group ID
    if (!isIdValid(groupId)) {
      throw Error("Cannot add group to user with empty group ID");
    }

    // Find user by username and add group ID to their groups array
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $addToSet: { groups: groupId } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw Error("Error adding group to user");
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error occurred when adding group to user: ${error}` };
  }
};

/**
 * Removes a group from a user's list of groups
 * @param username - The username of the user
 * @param groupId - The ID of the group to remove
 * @returns - The updated user or an error message
 */
export const removeGroupFromUser = async (username, groupId) => {
  try {
    // Validate username
    if (!isUsernameValid(username)) {
      throw Error("Cannot add group to user with empty username");
    }
    // Validate group ID
    if (!isIdValid(groupId)) {
      throw Error("Cannot add group to user with empty group ID");
    }
    // Find user by username and remove group ID from their groups array
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $pull: { groups: groupId } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw Error("Error removing group from user");
    }

    return updatedUser;
  } catch (error) {
    return { error: `Error occurred when removing group from user: ${error}` };
  }
};

/**
 * Adds a group invite to a user's list of group invites
 * @param username - The username of the user
 * @param groupInviteId - The ID of the group invite to add
 * @returns - The updated user or an error message
 */
export const addGroupInviteToUser = async (username, groupInviteId) => {
  try {
    // Validate username
    if (!isUsernameValid(username)) {
      throw Error("Cannot add group invite to user with empty username");
    }
    // Validate group invite ID
    if (!isIdValid(groupInviteId)) {
      throw Error("Cannot add group invite to user with empty group invite ID");
    }

    // Find user by username and add group invite ID to their groupInvites array
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $addToSet: { groupInvites: groupInviteId } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw Error("Error adding group invite to user");
    }

    return updatedUser;
  } catch (error) {
    return {
      error: `Error occurred when adding group invite to user: ${error}`,
    };
  }
};

/**
 * Removes a group invite from a user's list of group invites
 * @param username - The username of the user
 * @param groupInviteId - The ID of the group invite to remove
 * @returns - The updated user or an error message
 */
export const removeGroupInviteFromUser = async (username, groupInviteId) => {
  try {
    // Validate username
    if (!isUsernameValid(username)) {
      throw Error("Cannot remove group invite from user with empty username");
    }

    // Validate group invite ID
    if (!isIdValid(groupInviteId)) {
      throw Error(
        "Cannot remove group invite from user with empty group invite ID"
      );
    }

    // Find user by username and remove group invite ID from their groupInvites array
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $pull: { groupInvites: groupInviteId } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      throw Error("Error removing group invite from user");
    }

    return updatedUser;
  } catch (error) {
    return {
      error: `Error occurred when removing group invite from user: ${error}`,
    };
  }
};
