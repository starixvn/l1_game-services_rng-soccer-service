import { Core } from "sc-game-base";
import mongoose from "mongoose";

export default mongoose.model("rngsoccer_results", Core.Models.ResultSchema);
