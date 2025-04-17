import GroupModel from "../../models/group.model.js";
import { v4 as uuidv4 } from "uuid";

export async function createGroup(usernames, groupName) {
  const newGroup = {
    _id: uuidv4(),
    groupName,
    users: [...usernames],
  };

  return await GroupModel.create(newGroup);
}

export async function getAllGroups() {
  const groups = await GroupModel.find();
  return groups;
}

export async function getGroupById(groupId) {
  const group = await GroupModel.find({ _id: groupId });
  return group;
}

export async function updateGroup(groupId, groupUpdates) {
  const updatedGroup = await GroupModel.findOneAndUpdate(
    { _id: groupId },
    groupUpdates,
    {
      new: true,
    }
  );
  return updatedGroup;
}

export async function deleteGroup(groupId) {
  const deletedGroup = await GroupModel.findOneAndDelete({ _id: groupId });
  return deletedGroup;
}
