import mongoose from "mongoose";

const bet = {
    uid: { type: String, required: true },
    name: { type: String, required: true },

    home: { type: Number, default: 0 },
    away: { type: Number, default: 0 },
    draw: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    betwin: { type: Number, default: 0 },
    time: { type: Date },
    odds: { type: Object },

    siteId: { type: String },
    freeBet: { type: Boolean, default: false },

    playerId: { type: String },
    operatorId: { type: String },
    roundId: { type: Number, default: 0, required: true },
    paid: { type: Boolean, default: false },
};

const bets = mongoose.model(
    "rngsoccer_bets",
    new mongoose.Schema({
        ...bet,
        currency: { type: String },
        rate: { type: Number, required: true },
    })
);
const tmpBets = mongoose.model("rngsoccer_tmpbets", new mongoose.Schema(bet));

export { bets, tmpBets };
