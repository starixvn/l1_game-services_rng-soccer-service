import { generateResult, getSettlementResult } from "../../../src/helpers/result-helper";

describe("result statistic: 100,000 times", () => {
    const calculateStreaks = (streaks, settlementResult, continuity) => {
        Object.keys(continuity).forEach((key) => {
            if (settlementResult[key]) {
                continuity[key]++;
            } else {
                if (continuity[key] >= 4) {
                    streaks[key][continuity[key]] = streaks[key][continuity[key]] ?? 0;
                    streaks[key][continuity[key]] += 1;
                }
                continuity[key] = 0;
            }
        });
    };
    // arrange
    const total = 100_000;
    for (let index = 0; index < 3; index++) {
        it(`should generate results statistically correct with mode ${index + 1}`, () => {
            // arrange
            const statisticResult = {
                home: 0,
                away: 0,
                draw: 0,
            };
            const streaks = { home: {}, away: {}, draw: {} };
            const continuity = { home: 0, away: 0, draw: 0 };

            // act
            for (let i = 0; i < total; i++) {
                const settlementResult = getSettlementResult(generateResult(index + 1));
                statisticResult.home += +settlementResult.home;
                statisticResult.away += +settlementResult.away;
                statisticResult.draw += +settlementResult.draw;
                calculateStreaks(streaks, settlementResult, continuity);
            }

            // assert
            const resultPercentage = Object.keys(statisticResult).reduce((percentage, key) => {
                percentage[key] = +parseFloat((statisticResult[key] / total) * 100).toFixed(2);

                return percentage;
            }, {});
            console.log(
                `Mode:${index + 1}, countResult: ${JSON.stringify(statisticResult)}, percentageResult: ${JSON.stringify(resultPercentage)}`
            );
            console.log(`streak on mode ${index + 1}: ${JSON.stringify(streaks, null, 2)}`);

            expect(resultPercentage.home).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.away).toBeGreaterThanOrEqual(44);
            expect(resultPercentage.draw).toBeLessThanOrEqual(10);
        });
    }
});
