import { createMovieQueue, createTVQueue, createAlbumQueue, createBookQueue, createVideoGameQueue, createPodcastQueue } from "../services/internal/queueService.js";
import {
  saveUser,
  loginUser,
  findUserByUsername,
  getUsersList,
  deleteUserById,
  updateUser,
  findUserById,
} from "../services/internal/userService.js";
import { v4 as uuidv4 } from "uuid";

const UserController = (app) => {
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

    const alreadyExistingUser = await findUserByUsername(req.body.username);
    if (alreadyExistingUser) {
      res.status(400).send("Username already exists");
      return;
    }

    const requestUser = req.body;

    const newUser = {
      ...requestUser,
      _id: uuidv4(),
      dateJoined: new Date(),
    };

    try {
      const result = await saveUser(newUser);

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Create the new queues for the user
      const movieQueueResult = await createMovieQueue(newUser.username, null);
      if ("error" in movieQueueResult) {
        throw new Error(movieQueueResult.error);
      }
      const tvQueueResult = await createTVQueue(newUser.username, null);
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }
      const albumQueueResult = await createAlbumQueue(newUser.username, null);
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }
      const bookQueueResult = await createBookQueue(newUser.username, null);
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }
      const videoGameQueueResult = await createVideoGameQueue(newUser.username, null);
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }
      const podcastQueueResult = await createPodcastQueue(newUser.username, null);
      if ("error" in podcastQueueResult) {
        throw new Error(podcastQueueResult.error);
      }

      req.session["currentUser"] = result;
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

      req.session["currentUser"] = user;
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Login failed");
    }
  };

  const getUserByID = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await findUserById(userId);

      if ("error" in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error when getting user by id: ${error}`);
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

  const deleteUserByID = async (req, res) => {
    try {
      const { userId } = req.params;

      const deletedUser = await deleteUserById(userId);

      if ("error" in deletedUser) {
        throw Error(deletedUser.error);
      }

      res.status(200).json(deletedUser);
    } catch (error) {
      res.status(500).send(`Error when deleting user by id: ${error}`);
    }
  };

  const updateUserByID = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = { ...req.body };
    try {
      const updatedUser = await updateUser(userId, {
        ...userUpdates,
      });

      if ("error" in updatedUser) {
        throw Error(updatedUser.error);
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user: ${error}`);
    }
  };

  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.status(200).json(currentUser);
  };

  app.post("/api/users/signup", createUser);
  app.post("/api/users/signout", signout);
  app.post("/api/users/login", userLogin);
  app.post("/api/users/profile", profile);
  app.get("/api/users", getUsers);
  app.get("/api/users/:userId", getUserByID);
  app.delete("/api/users/:userId", deleteUserByID);
  app.put("/api/users/:userId", updateUserByID);
};

export default UserController;
