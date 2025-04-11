import { saveUser, loginUser, getUserByUsername, getUsersList, deleteUserByUsername, updateUser } from "../services/internal/userService.js";

const userController = (app) => {
  const isUserBodyValid = (req) =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== "" &&
    req.body.password !== undefined &&
    req.body.password !== "";

  const createUser = async (req, res) => {
    if (!isUserBodyValid(req)) {
      res.status(400).send("Invalid user body");
      return;
    }

    const requestUser = req.body;

    const user = {
      ...requestUser,
      dateJoined: new Date(),
      biography: requestUser.biography ?? "",
    };

    try {
      const result = await saveUser(user);

      if ("error" in result) {
        throw new Error(result.error);
      }

      res.status(200).json(result);
    } catch (error) {
      res.status(500).send(`Error when saving user: ${error}`);
    }
  };

  const userLogin = async (req, res) => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send("Invalid user body");
        return;
      }

      const loginCredentials = {
        username: req.body.username,
        password: req.body.password,
      };

      const user = await loginUser(loginCredentials);

      if ("error" in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Login failed");
    }
  };

  const getUser = async (req, res) => {
    try {
      const { username } = req.params;

      const user = await getUserByUsername(username);

      if ("error" in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error when getting user by username: ${error}`);
    }
  };

  const getUsers = async (req, res) => {
    try {
      const users = await getUsersList();

      if ("error" in users) {
        throw Error(users.error);
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting users: ${error}`);
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const { username } = req.params;

      const deletedUser = await deleteUserByUsername(username);

      if ("error" in deletedUser) {
        throw Error(deletedUser.error);
      }

      socket.emit("userUpdate", {
        user: deletedUser,
        type: "deleted",
      });
      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send(`Error when deleting user by username: ${error}`);
    }
  };

  const resetPassword = async (req, res) => {
    try {
      if (!isUserBodyValid(req)) {
        res.status(400).send("Invalid user body");
        return;
      }

      const updatedUser = await updateUser(req.body.username, {
        password: req.body.password,
      });

      if ("error" in updatedUser) {
        throw Error(updatedUser.error);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user password: ${error}`);
    }
  };

  // Define routes for the user-related operations.
  app.post("/signup", createUser);
  app.post("/login", userLogin);
  app.patch("/resetPassword", resetPassword);
  app.get("/getUser/:username", getUser);
  app.get("/getUsers", getUsers);
  app.delete("/deleteUser/:username", deleteUser);
};

export default userController;
