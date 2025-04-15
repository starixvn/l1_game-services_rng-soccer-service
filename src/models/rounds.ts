import mongoose from "mongoose";
import { Result, SettlementResult, Match } from "../constants";
const modelName = "rngsoccer_rounds";

const resultSchema = new mongoose.Schema<Result>(
    {
        home: { type: Object, required: true },
        away: { type: Object, required: true },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema<SettlementResult>(
    {
        home: { type: Boolean, default: false },
        away: { type: Boolean, default: false },
        draw: { type: Boolean, default: false },
    },
    { _id: false }
);

const matchSchema = new mongoose.Schema<Match>({
    home: { type: String, required: true },
    away: { type: String, required: true },
});

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    match: matchSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, required: true },
});

export default mongoose.model(modelName, Schema);
