import GroupModel from "../../models/group.model.js";
import { v4 as uuidv4 } from "uuid";
import { isInputStringValid } from "../utils.js";

/**
 * Creates a new group based on the provided name and creator
 * @param name - The name of the group
 * @param creator - The username of the user who created the group
 * @returns - The created group object or an error message
 */
export async function createGroup(name, creator) {
  try {
    // Validate group properties
    if (!isInputStringValid(creator)) {
      throw new Error("Invalid creator username");
    }

    if (!isInputStringValid(name)) {
      throw new Error("Invalid group name");
    }

    const newGroup = {
      _id: uuidv4(),
      name,
      creator,
      members: [creator],
    };

    const createdGroup = await GroupModel.create(newGroup);

    if (!createdGroup) {
      throw new Error("Failed to create group");
    }

    return createdGroup;
  } catch (error) {
    return { error: `Failed to create group: ${error.message}` };
  }
}

/**
 * Retrieves all groups stored
 * @returns - An array of group objects or an error message
 */
export async function getAllGroups() {
  try {
    const groups = await GroupModel.find({});

    if (!groups || groups.length === 0) {
      throw new Error("No groups found");
    }

    return groups;
  } catch (error) {
    return { error: `Failed to get groups: ${error.message}` };
  }
}

/**
 * Retrieves all groups for a specific user
 * @param username - The username of the user
 * @returns - An array of group objects or an error message
 */
export async function getAllGroupsForUser(username) {
  try {
    // Validate username
    if (!isInputStringValid(username)) {
      throw new Error("Invalid username");
    }

    // Find all groups where the user is a member
    const groups = await GroupModel.find({ members: { $in: [username] } });

    if (!groups || groups.length === 0) {
      return [];
    }

    return groups;
  } catch (error) {
    return { error: `Failed to get groups: ${error.message}` };
  }
}

/**
 * Retrieves a group by its ID
 * @param groupId - The ID of the group
 * @returns - The group object or an error message
 */
export async function getGroupById(groupId) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    // Find group by ID
    const group = await GroupModel.find({ _id: groupId });

    if (!group) {
      throw new Error("Group not found");
    }

    return group;
  } catch (error) {
    return { error: `Failed to get group: ${error.message}` };
  }
}

/**
 * Updates a group by its ID
 * @param groupId - The ID of the group
 * @param groupUpdates - The updates to apply to the group
 * @returns - The updated group object or an error message
 */
export async function updateGroup(groupId, groupUpdates) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      groupUpdates,
      {
        new: true,
      }
    );

    if (!updatedGroup) {
      throw new Error("Group not found");
    }

    return updatedGroup;
  } catch (error) {
    return { error: `Failed to update group: ${error.message}` };
  }
}

/**
 * Deletes a group by its ID
 * @param groupId - The ID of the group
 * @returns - The deleted group object or an error message
 */
export async function deleteGroup(groupId) {
  try {
    // Validate group ID
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    const deletedGroup = await GroupModel.findOneAndDelete({ _id: groupId });

    if (!deletedGroup) {
      throw new Error("Group not found");
    }

    return deletedGroup;
  } catch (error) {
    return { error: `Failed to delete group: ${error.message}` };
  }
}

/**
 * Removes a user from a group
 * @param groupId - The ID of the group
 * @param username - The username of the user to remove
 * @returns - The updated group object or an error message
 */
export async function leaveGroup(groupId, username) {
  try {
    // Validate group ID and username
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    if (!isInputStringValid(username)) {
      throw new Error("Invalid username");
    }

    // Find the group by ID and remove the user from its members
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $pull: { members: username } },
      { new: true }
    );

    if (!updatedGroup) {
      throw new Error("Group not found");
    }

    return updatedGroup;
  } catch (error) {
    return { error: `Failed to leave/remove from group: ${error.message}` };
  }
}

/**
 * Adds a user to a group
 * @param groupId - The ID of the group
 * @param username - The username of the user to add
 * @returns - The updated group object or an error message
 */
export async function addUserToGroup(groupId, username) {
  try {
    // Validate group ID and username
    if (!isInputStringValid(groupId)) {
      throw new Error("Invalid group ID");
    }

    if (!isInputStringValid(username)) {
      throw new Error("Invalid username");
    }

    // Find the group by ID and add the user to its members
    const updatedGroup = await GroupModel.findOneAndUpdate(
      { _id: groupId },
      { $addToSet: { members: username } },
      { new: true }
    );

    if (!updatedGroup) {
      throw new Error("Group not found");
    }

    return updatedGroup;
  } catch (error) {
    return { error: `Failed to add user to group: ${error.message}` };
  }
}
