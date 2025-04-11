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
    const user = await UserModel.findOne({ username: username }).select(
      "-password"
    );

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
