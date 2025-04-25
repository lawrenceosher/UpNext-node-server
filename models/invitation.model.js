import mongoose from "mongoose";
import invitationSchema from "../schemas/invitation.schema.js";

/**
 * Mongoose model for the `Invitation` collection.
 *
 * This model is created using the `Invitation` interface and the `invitationSchema`, representing the
 * `Invitation` collection in the MongoDB database, and provides an interface for interacting with
 * the stored invitations.
 *
 */
const InvitationModel = mongoose.model("InvitationModel", invitationSchema);

export default InvitationModel;
