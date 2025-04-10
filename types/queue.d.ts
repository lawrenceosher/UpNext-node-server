import { Movie } from "./movie";
import { TV } from "./tv";
import { Album } from "./album";
import { Book } from "./book";
import { Podcast } from "./podcast";
import { VideoGame } from "./game";
import { User } from "./user";
import { Group } from "./group";

// Union type for the different types of media that can be enqueued
export type MediaItem = Movie | TV | Album | Book | Podcast | VideoGame;

/**
 * Represents a list of media items that users have yet to watch or have watched.
 * - `_id`: The unique id of the queue.
 * - `mediaType`: The type of media corresponding to the queue. Either 'Movie', 'TV', 'Album', 'Book', 'Podcast', or 'Video Game'.
 * - `users`: The users that this Queue belongs to. Can either be a single user or multiple if the group is defined
 * - `group`: Optional field that contains the group object if this is a group queue.
 * - `current`: A list of the current media items the user has yet to watch.
 * - `history`: A list of the past media items that the user has already watched.
 */
export interface Queue {
  _id: string;
  mediaType: string;
  users: User[];
  group?: Group;
  current: MediaItem[];
  history: MediaItem[];
}

/**
 * Represents the response for queue-related operations.
 * - `Queue`: A queue object if the operation is successful.
 * - `error`: An error message if the operation fails.
 */
export type QueueResponse = Queue | { error: string };
