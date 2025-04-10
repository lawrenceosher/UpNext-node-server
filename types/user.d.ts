import { Request } from "express";

/**
 * Represents user credentials for authentication.
 * - `username`: The unique username of the user.
 * - `password`: The user's password.
 */
export interface UserCredentials {
  username: string;
  password: string;
}

/**
 * Represents a user document, including user credentials and additional details.
 * - `username`: The unique username of the user.
 * - `password`: The user's password.
 * - `_id`: The unique identifier for the user.
 * - `firstName`: The first name of the user.
 * - `lastName`: The last name of the user.
 * - `dateJoined`: The date when the user registered.
 * - `email`: The user's email address.
 * - `role`: The user's role, either 'USER' or 'ADMIN'.
 * - `followers`: An array of users representing the users that follow this user.
 * - `following`: An array of users representing the users that this user follows.
 */
export interface User extends UserCredentials {
  _id: string;
  firstName: string;
  lastName: string;
  dateJoined: Date;
  email: string;
  role: string;
  followers: User[];
  following: User[];
}

/**
 * Express request for user login, containing user credentials.
 * - `username`: The username submitted in the request (body).
 * - `password`: The password submitted in the request (body).
 */
export interface UserRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

/**
 * Express request for querying a user by their username.
 * - `username`: The username provided as a route parameter.
 */
export interface UserByUsernameRequest extends Request {
  params: {
    username: string;
  };
}

/**
 * Represents a "safe" user object that excludes sensitive information like the password.
 */
export type SafeUser = Omit<User, "password">;

/**
 * Represents the response for user-related operations.
 * - `SafeDatabaseUser`: A user object without sensitive data if the operation is successful.
 * - `error`: An error message if the operation fails.
 */
export type UserResponse = SafeUser | { error: string };

/**
 * Represents the response for multiple user-related operations.
 * - `SafeDatabaseUser[]`: A list of user objects without sensitive data if the operation is successful.
 * - `error`: An error message if the operation fails.
 */
export type UsersResponse = SafeUser[] | { error: string };
