import {
  createMovieQueue,
  createTVQueue,
  createAlbumQueue,
  createBookQueue,
  createVideoGameQueue,
  createPodcastQueue,
  deleteQueueByMediaTypeAndUsernameAndGroup,
} from "../services/internal/queueService.js";
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

/**
 * Handles user-related routes and operations.
 * It provides functionality for user signup, login, fetching user details,
 * updating user information, and deleting users.
 * It also manages user sessions and personal queues.
 * @param app - The Express app instance
 */
const UserController = (app) => {
  /**
   * Checks if the request body contains valid user information.
   * @param req - The request object
   * @returns - True if the user body is valid, false otherwise
   */
  const isUserBodyValid = (req) =>
    req.body !== undefined &&
    req.body.username !== undefined &&
    req.body.username !== "" &&
    req.body.password !== undefined &&
    req.body.password !== "";

  /**
   * Creates a new user and their corresponding personal queues (one for each media type)
   * @param req - The incoming request containing information about the new user
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the newly created user or 500 (error) with an error message
   */
  const createUser = async (req, res) => {
    // Validate the body of the request with the new user information
    if (!isUserBodyValid(req)) {
      res.status(400).send("Invalid user body");
      return;
    }

    // If there is already a user with that username, return a bad request since usernames must be unique
    const alreadyExistingUser = await findUserByUsername(req.body.username);
    if (alreadyExistingUser && alreadyExistingUser.error === undefined) {
      res.status(400).send("Username already exists");
      return;
    }

    // Extract the requested user information from the body of the request
    const requestUser = req.body;

    const newUser = {
      ...requestUser,
      _id: uuidv4(),
      dateJoined: new Date(),
    };

    try {
      const resultUser = await saveUser(newUser);

      if ("error" in resultUser) {
        throw new Error(resultUser.error);
      }

      // Create the new queues for the user (one for each media type)
      const movieQueueResult = await createMovieQueue(
        resultUser.username,
        null
      );
      if ("error" in movieQueueResult) {
        throw new Error(movieQueueResult.error);
      }

      const tvQueueResult = await createTVQueue(resultUser.username, null);
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }

      const albumQueueResult = await createAlbumQueue(
        resultUser.username,
        null
      );
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }

      const bookQueueResult = await createBookQueue(resultUser.username, null);
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }

      const videoGameQueueResult = await createVideoGameQueue(
        resultUser.username,
        null
      );
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }

      const podcastQueueResult = await createPodcastQueue(
        resultUser.username,
        null
      );
      if ("error" in podcastQueueResult) {
        throw new Error(podcastQueueResult.error);
      }

      req.session["currentUser"] = resultUser;
      res.status(200).json(resultUser);
    } catch (error) {
      res
        .status(500)
        .send(`Error when creating user and their queues: ${error.message}`);
    }
  };

  /**
   * Allows the user to try to log in to the application if their credentials are valid. Used for authentication.
   * @param req - The incoming request containing the username and password of user
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response of the logged-in user information or 500 (error) with an error message
   */
  const userLogin = async (req, res) => {
    // Validate the body of the request to make sure the username and password are valid
    if (!isUserBodyValid(req)) {
      res.status(400).send("Invalid user body");
      return;
    }

    try {
      // Extract the login credentials from the request body
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
      res.status(401).json("Unable to login. Try again later.");
    }
  };

  /**
   * Retrieves a user by their ID.
   * @param req - The incoming request containing the user ID
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the user information or 500 (error) with an error message
   */
  const getUserByID = async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await findUserById(userId);

      if ("error" in user) {
        throw Error(user.error);
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).send(`Error retrieving user: ${error.message}`);
    }
  };

  /**
   * Retrieves a list of all users.
   * @param req - The incoming request
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the list of users or 500 (error) with an error message
   */
  const getUsers = async (req, res) => {
    try {
      const users = await getUsersList();

      if ("error" in users) {
        throw Error(users.error);
      }

      res.status(200).json(users);
    } catch (error) {
      res.status(500).send(`Error when getting users: ${error.message}`);
    }
  };

  /**
   * Deletes a user by their ID and their corresponding personal queues.
   * @param req - The incoming request containing the user ID
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the deleted user information or 500 (error) with an error message
   */
  const deleteUserByID = async (req, res) => {
    try {
      const { userId } = req.params;

      const deletedUser = await deleteUserById(userId);

      if ("error" in deletedUser) {
        throw Error(deletedUser.error);
      }

      // Delete the corresponding personal queues for user
      const movieQueueResult = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "Movie",
        deletedUser.username,
        null
      );
      if ("error" in movieQueueResult) {
        throw new Error(movieQueueResult.error);
      }

      const tvQueueResult = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "TV",
        deletedUser.username,
        null
      );
      if ("error" in tvQueueResult) {
        throw new Error(tvQueueResult.error);
      }

      const albumQueueResult = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "Album",
        deletedUser.username,
        null
      );
      if ("error" in albumQueueResult) {
        throw new Error(albumQueueResult.error);
      }

      const bookQueueResult = await deleteQueueByMediaTypeAndUsernameAndGroup(
        "Book",
        deletedUser.username,
        null
      );
      if ("error" in bookQueueResult) {
        throw new Error(bookQueueResult.error);
      }

      const videoGameQueueResult =
        await deleteQueueByMediaTypeAndUsernameAndGroup(
          "VideoGame",
          deletedUser.username,
          null
        );
      if ("error" in videoGameQueueResult) {
        throw new Error(videoGameQueueResult.error);
      }

      const podcastQueueResult =
        await deleteQueueByMediaTypeAndUsernameAndGroup(
          "Podcast",
          deletedUser.username,
          null
        );
      if ("error" in podcastQueueResult) {
        throw new Error(podcastQueueResult.error);
      }

      res.status(200).json(deletedUser);
    } catch (error) {
      res
        .status(500)
        .send(
          `Error when deleting user and its corresponding queues: ${error.message}`
        );
    }
  };

  /**
   * Updates a user by their ID.
   * @param req - The incoming request containing the user ID and the updated user information
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the updated user information or 500 (error) with an error message
   */
  const updateUserByID = async (req, res) => {
    const { userId } = req.params;

    // Extract the updated user information from the request body
    const userUpdates = { ...req.body };
    try {
      const updatedUser = await updateUser(userId, {
        ...userUpdates,
      });

      if ("error" in updatedUser) {
        throw Error(updatedUser.error);
      }

      // Update the session with the updated user information
      const currentUser = await findUserById(userId);
      req.session["currentUser"] = currentUser;

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).send(`Error when updating user: ${error}`);
    }
  };

  /**
   * Signs out the current user by destroying the session.
   * @param req - The incoming request
   * @param res - The response to send back to the client
   * @returns 200 (success) with no content
   */
  const signout = (req, res) => {
    // Destroy the session to sign out the user
    req.session.destroy();
    res.sendStatus(200);
  };

  /**
   * Retrieves the profile of the currently logged-in user.
   * @param req - The incoming request
   * @param res - The response to send back to the client
   * @returns Either 200 (success) with a JSON response containing the current user information or 401 (unauthorized) if no user is logged in
   */
  const profile = async (req, res) => {
    // Check if the user is logged in by checking the session
    const currentUser = req.session["currentUser"];

    // If there is no user in the session, return a 401 Unauthorized status
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    // If the user is logged in, return their information
    res.status(200).json(currentUser);
  };

  // Routes for user-related operations
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
