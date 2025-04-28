import UserModel from "../../models/user.model.js";

export const saveUser = async (user) => {
  try {
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
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: result.role,
    };

    return safeUser;
  } catch (error) {
    return { error: error };
  }
};

export const findUserByUsername = async (username) => {
  try {
    const user = await UserModel.findOne({ username: username })
      .select("-password")
      .select("-firstName")
      .select("-lastName")
      .select("-email");

    return user;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

export const findUserById = async (id) => {
  try {
    const user = await UserModel.findOne({ _id: id }).select("-password");

    if (!user) {
      throw Error("User not found");
    }
    return user;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

export const getUsersList = async () => {
  try {
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

export const deleteUserById = async (id) => {
  try {
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

export const updateUser = async (id, updates) => {
  try {
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

export const addGroupToUser = async (userId, groupId) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
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

export const removeGroupFromUser = async (userId, groupId) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
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

export const addGroupInviteToUser = async (userId, groupInviteId) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
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

export const removeGroupInviteFromUser = async (userId, groupInviteId) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId },
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
