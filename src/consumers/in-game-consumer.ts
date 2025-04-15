import { InGameConsumer as InGameConsumerBase } from "sc-game-base/src/core/event-consumers";
import GameData from "../game-data";

export default class InGameConsumer extends InGameConsumerBase {
    async buildPayload(realPlayer: any) {
        const payload = await super.buildPayload(realPlayer);
        const { match } = this.gameData as GameData;
        return { ...payload, match };
    }

    async consume(realPlayer: any) {
        const { remainingTime, gameConfigs, umMessages } = this.gameData;
        const disabled = !gameConfigs?.enabled;
        if (disabled) {
            realPlayer.socketClient.emit(this.definition.name, { remainingTime, um: disabled, um_message: umMessages });
        }
        const payload = await this.buildPayload(realPlayer);
        this.publisher.publishToUser(realPlayer.UID, payload);
    }
}
