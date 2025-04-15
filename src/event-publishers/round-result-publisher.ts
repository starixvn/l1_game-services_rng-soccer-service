import { Core } from "sc-game-base";
import GameData from "../game-data";

export default class RoundResultPublisher extends Core.BaseEventPublishers.RoundResultPublisher {
    declare gameData: GameData;
    publishToAllUsers(payload: any) {
        super.publishToAllUsers(payload);

        Object.values(this.gameData.viewPlayers).forEach((socket) => {
            socket?.emit(this.gameName, payload);
        });
    }
}
