import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";
describe("result-helper test", () => {
    describe("generateRawResultForHash", () => {
        it("should return as expected", () => {
            // arrange
            const roundResult = {
                home: { rank: 0, suit: 0 },
                away: { rank: 10, suit: 1 },
            };
            const expected = "{A♥ J♦}";

            // act
            const actual = generateRawResultForHash(roundResult);

            // assert
            expect(actual).toBe(expected);
        });
    });
});
