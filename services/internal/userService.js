import UserModel from "../../models/user.model";

export const saveUser = async (user) => {
  try {
    // Check if user already exists
    const userExists = await getUserByUsername(user.username);
    if (userExists) {
      throw Error("User already exists");
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
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email,
      role: result.role,
      followers: result.followers,
      following: result.following,
    };

    return safeUser;
  } catch (error) {
    return { error: `Error occurred when saving user: ${error}` };
  }
};

export const getUserByUsername = async (username) => {
  try {
    const user = await UserModel.findOne({ username }).select("-password");

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

export const deleteUserByUsername = async (username) => {
  try {
    const deletedUser = await UserModel.findOneAndDelete({
      username,
    }).select("-password");

    if (!deletedUser) {
      throw Error("Error deleting user");
    }

    return deletedUser;
  } catch (error) {
    return { error: `Error occurred when finding user: ${error}` };
  }
};

export const updateUser = async (username, updates) => {
  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
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
