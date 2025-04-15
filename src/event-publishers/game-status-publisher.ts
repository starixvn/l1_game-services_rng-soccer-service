import { GameStatusPublisher as GameStatusPublisherBase } from "sc-game-base/src/core/event-publishers";
import GameData from "../game-data";

export default class GameStatusPublisher extends GameStatusPublisherBase {
    override publishStartGame() {
        this.publishToAllUsers({
            remainingTime: this.gameData.remainingTime,
            snr: true,
            match: (this.gameData as GameData).match,
        });

        this.publishToAllAdmins({
            currencies: this.gameData.currencies,
            exchangeRates: this.gameData.exchangeRates,
            match: (this.gameData as GameData).match,
        });
    }
}
