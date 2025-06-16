import { Socket } from "socket.io";
import { GameDefinition } from "sc-game-base/src/core";
import GameData from "../game-data";
import { RoundQuery } from "../query-apis";

export default class ViewConsumer {
    private readonly definition: GameDefinition;
    private readonly gameData: GameData;
    private readonly roundQuery: RoundQuery;

    constructor(definition: GameDefinition, gameData: GameData, roundQuery: RoundQuery) {
        this.definition = definition;
        this.gameData = gameData;
        this.roundQuery = roundQuery;
    }

    async consume(socketClient: Socket, id: string) {
        const { remainingTime, gameConfigs, umMessages, delayStartTime } = this.gameData;
        const disabled = !gameConfigs || !gameConfigs.enabled || delayStartTime > 0;

        if (disabled) {
            socketClient.emit(this.definition.name, { remainingTime, um: disabled, um_message: umMessages });
        } else {
            const payload = await this.buildPayload();
            socketClient.emit(this.definition.name, { [id]: payload });
        }
    }

    async buildPayload() {
        const { odds, originalOdds, enableFreeBet, boostedChoices } = this.gameData.gameConfigs;
        const { totalBets, roundId, remainingTime, match } = this.gameData;
        const gameConfigs = { odds, originalOdds, enableFreeBet, boostedChoices };
        const roundHistory = await this.roundQuery.getList(this.definition.numberOfRoundHistory);

        return {
            remainingTime,
            roundId,
            gameConfigs,
            roundHistory,
            ownBets: {},
            totalBets,
            match,
        };
    }
}
