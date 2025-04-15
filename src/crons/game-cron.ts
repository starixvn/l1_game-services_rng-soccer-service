import { BaseGameCron } from "sc-game-base/src/core/crons";
import GameData from "../game-data";
import { getRandomMatch } from "../helpers/match-helper";

export class GameCron extends BaseGameCron {
    private readonly MATCH_UPDATE_INTERVAL = 10;
    declare gameData: GameData;

    override async getSettingForNewRound(): Promise<void> {
        await super.getSettingForNewRound();
        const { roundId, match } = this.gameData;
        if (roundId % this.MATCH_UPDATE_INTERVAL === 1 || !match?.home) {
            this.gameData.match = getRandomMatch();
        }
    }
}
