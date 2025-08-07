import { BaseGameCron } from "sc-game-base/src/core/crons";
import GameData from "../game-data";
import { getRandomMatch } from "../helpers/match-helper";

export class GameCron extends BaseGameCron {
    declare gameData: GameData;
    override async getSettingForNewRound(): Promise<void> {
        await super.getSettingForNewRound();
        this.gameData.match = getRandomMatch();
    }
}
