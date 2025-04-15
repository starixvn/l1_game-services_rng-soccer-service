import BasePlaceBetConsumer from "sc-game-base/src/core/event-consumers/place-bet-consumer";
import { helpers } from "sc-common";
import { Duration } from "../game-settings";

export default class PlaceBetConsumer extends BasePlaceBetConsumer {
    composeBettingTimeValidationCriteria(roundId: number) {
        const configs = this.gameData.gameConfigs;
        const dealCardsTime = this.definition.durations.placingBets + (this.definition.durations as Duration).dealCards;

        return [
            {
                failure: !configs.enabled,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
            {
                failure: roundId !== this.gameData.roundId,
                notice: this.getNoticeObj(helpers.noticeHelper.invalidBet, { gameRoundId: roundId }),
            },
            {
                failure:
                    this.gameData.remainingTime >= this.definition.durations.placingBets && this.gameData.remainingTime <= dealCardsTime,
                notice: this.getNoticeObj(helpers.noticeHelper.cannotPlaceBet),
            },
            {
                failure: this.gameData.remainingTime < this.definition.durations.lockingBet || this.gameData.remainingTime > dealCardsTime,
                notice: this.getNoticeObj(helpers.noticeHelper.placeBetNextRound),
            },
        ];
    }
}
