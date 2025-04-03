import mongoose from "mongoose";

const modelName = "rngsoccer_rounds";

const resultSchema = new mongoose.Schema(
    {
        home: { type: Object },
        away: { type: Object },
    },
    { _id: false }
);

const settlementResultSchema = new mongoose.Schema(
    {
        home: { type: Boolean, default: false },
        away: { type: Boolean, default: false },
        draw: { type: Boolean, default: false },
    },
    { _id: false }
);

const Schema = new mongoose.Schema({
    id: { type: Number, required: true },
    result: resultSchema,
    settlementResult: settlementResultSchema,
    time: { type: Date, default: new Date() },
    exchangeRateId: { type: Number, required: true },
});

export default mongoose.model(modelName, Schema);
