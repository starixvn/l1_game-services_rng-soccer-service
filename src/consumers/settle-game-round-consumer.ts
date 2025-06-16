import { SettleGameRoundConsumer as SettleGameRoundConsumerBase } from "sc-game-base/src/core/event-consumers";
import { BET_CHOICES, SettlementResult } from "../constants";
import GameData from "../game-data";

export default class SettleGameRoundConsumer extends SettleGameRoundConsumerBase {
    async settleRound() {
        const result = this.generateResult();
        const settlementResult = this.definition.settle(result);
        const { roundId, exchangeRates, match } = this.gameData as GameData;
        const newRound = await this.roundsRepository.create({
            id: roundId,
            result,
            settlementResult,
            time: new Date(),
            exchangeRateId: exchangeRates.exId,
            match,
        });

        if (newRound) {
            this.roundResultPublisher.publishRoundResult({
                result,
                settlementResult,
                roundId,
            });

            const finish = {
                settlementResult,
                result,
                roundId: newRound.id,
                time: newRound.time,
            };

            this.gameData.roundId = finish.roundId + 1;

            await this.settleBets(finish);

            this.roundResultPublisher.publishWinners(roundId, this.gameData.winningPlayers);
        }
    }

    generateResult() {
        const { settlementResultFromAdmin, gameConfigs } = this.gameData;
        return this.gameData.roundId === settlementResultFromAdmin.roundId
            ? settlementResultFromAdmin.result
            : this.definition.generateResult(gameConfigs.randomMode);
    }

    calculateBetResult(settlementResult: SettlementResult, bet: any, odds: any) {
        const { choices } = this.definition;

        const betResult = Object.entries(settlementResult)
            .filter(([choice, win]) => choices.includes(choice))
            .reduce(
                (result, [choice, win]) => {
                    if (choice === BET_CHOICES.draw && win) {
                        const homeBet = bet[BET_CHOICES.home] ?? 0;
                        const awayBet = bet[BET_CHOICES.away] ?? 0;
                        const refund = (homeBet + awayBet) / 2;

                        result.totalWin += refund;
                    }

                    const betAmount = bet[choice] ?? 0;
                    const originalOdds = odds[choice] || 1;
                    const winAmount = win ? betAmount * originalOdds : 0;

                    result.totalBetAmount += betAmount;
                    result.totalWin += winAmount;
                    result.winningByChoices[choice] = winAmount;

                    if (winAmount > 0) {
                        result.netWin += winAmount - betAmount;
                    } else {
                        result.totalLost += betAmount;
                    }
                    return result;
                },
                {
                    totalBetAmount: 0,
                    totalWin: 0,
                    netWin: 0,
                    totalLost: 0,
                    winningByChoices: {} as any,
                }
            );

        betResult.totalWin = parseFloat(betResult.totalWin.toFixed(2));
        betResult.netWin = parseFloat(betResult.netWin.toFixed(2));

        return betResult;
    }
}
