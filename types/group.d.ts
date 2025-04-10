import { User } from "./user";

export interface Group {
  _id: string;
  groupName: string;
  users: User[];
}
