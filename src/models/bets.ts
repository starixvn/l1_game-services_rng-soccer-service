import mongoose from "mongoose";
import { BetSchema } from "sc-game-base/src/core/models";

const bet = {
    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
};
const betModel = { ...BetSchema.betBaseSchema, ...bet };

const bets = mongoose.model("rngsoccer_bets", new mongoose.Schema(betModel));

export { bets };
