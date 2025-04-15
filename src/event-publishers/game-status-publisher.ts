import { GameStatusPublisher as GameStatusPublisherBase } from "sc-game-base/src/core/event-publishers";
import GameData from "../game-data";

export default class GameStatusPublisher extends GameStatusPublisherBase {
    declare gameData: GameData;
    publishToAllUsers(payload: any) {
        super.publishToAllUsers(payload);

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            socket?.emit(this.gameName, payload);
        });
    }

    publishEnablingGameStatus() {
        super.publishEnablingGameStatus();

        const { gameConfigs, remainingTime } = this.gameData;
        const configs = {
            odds: gameConfigs.odds,
            originalOdds: gameConfigs.originalOdds,
            enableFreeBet: gameConfigs.enableFreeBet,
        };

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            const payload = { gameConfigs: { ...configs }, remainingTime, snr: true };
            socket?.emit(this.gameName, payload);
        });
    }

    override publishStartGame() {
        this.publishToAllUsers({
            remainingTime: this.gameData.remainingTime,
            snr: true,
            match: this.gameData.match,
        });

        this.publishToAllAdmins({
            currencies: this.gameData.currencies,
            exchangeRates: this.gameData.exchangeRates,
            match: this.gameData.match,
        });
    }
}
