import mongoose from "mongoose";
import tokenSchema from "../schemas/token.schema.js";

const TokenModel = mongoose.model("TokenModel", tokenSchema);

export default TokenModel;
