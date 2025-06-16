import { RoundQuery as RoundQueryBase } from "sc-game-base/src/core/query-apis";

export default class RoundQuery extends RoundQueryBase {
    override async getList(limit: number, projections?: any): Promise<any> {
        const rounds = await this.roundsRepository
            .find({}, projections, { sort: { _id: -1 }, limit: limit })
            .lean()
            .exec();

        return rounds.map((round: any) => {
            const result = round.result ?? this.convertResult(round);
            const settlementResult = round.settlementResult ?? this.convertSettlementResult(result);

            return {
                roundId: round.id,
                result,
                settlementResult,
                match: round.match,
            };
        });
    }
}
