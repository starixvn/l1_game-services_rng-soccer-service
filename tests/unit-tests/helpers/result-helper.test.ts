import { generateResult, getSettlementResult, generateRawResultForHash } from "../../../src/helpers/result-helper";
import { Result, Card, SettlementResult } from "../../../src/constants";
import { ranks, suits } from "../../../src/helpers/card";

describe("ResultHelper", () => {
    describe("generateResult", () => {
        it("should generate a valid result with two different cards", () => {
            // Arrange
            const randomMode = 1;

            // Act
            const result = generateResult(randomMode);

            // Assert
            expect(result).toBeDefined();
            expect(result.home).toBeDefined();
            expect(result.away).toBeDefined();
            expect(result.home).not.toEqual(result.away);
        });

        it("should use default random mode when invalid mode provided", () => {
            // Arrange
            const invalidMode = 999;

            // Act
            const result = generateResult(invalidMode);

            // Assert
            expect(result).toBeDefined();
            expect(result.home).toBeDefined();
            expect(result.away).toBeDefined();
        });
    });

    describe("getSettlementResult", () => {
        it("should return home win when home rank is higher", () => {
            // Arrange
            const result: Result = {
                home: { rank: 13, suit: 0 } as Card, // King
                away: { rank: 2, suit: 0 } as Card, // 2
            };

            // Act
            const settlement = getSettlementResult(result);

            // Assert
            const expected: SettlementResult = {
                home: true,
                away: false,
                draw: false,
            };
            expect(settlement).toEqual(expected);
        });

        it("should return away win when away rank is higher", () => {
            // Arrange
            const result: Result = {
                home: { rank: 2, suit: 0 } as Card,
                away: { rank: 13, suit: 0 } as Card,
            };

            // Act
            const settlement = getSettlementResult(result);

            // Assert
            const expected: SettlementResult = {
                home: false,
                away: true,
                draw: false,
            };
            expect(settlement).toEqual(expected);
        });

        it("should return draw when ranks are equal", () => {
            // Arrange
            const result: Result = {
                home: { rank: 10, suit: 0 } as Card,
                away: { rank: 10, suit: 1 } as Card,
            };

            // Act
            const settlement = getSettlementResult(result);

            // Assert
            const expected: SettlementResult = {
                home: false,
                away: false,
                draw: true,
            };
            expect(settlement).toEqual(expected);
        });
    });

    describe("generateRawResultForHash", () => {
        it("should generate correct hash string format", () => {
            // Arrange
            const result: Result = {
                home: { rank: 13, suit: 0 } as Card, // King of Hearts
                away: { rank: 2, suit: 1 } as Card, // 2 of Diamonds
            };

            // Act
            const hashString = generateRawResultForHash(result);

            // Assert
            expect(hashString).toBe(`{${ranks[13]}${suits[0]} ${ranks[2]}${suits[1]}}`);
        });

        it("should handle different card combinations", () => {
            // Arrange
            const result: Result = {
                home: { rank: 1, suit: 3 } as Card, // Ace of Spades
                away: { rank: 12, suit: 2 } as Card, // Queen of Clubs
            };

            // Act
            const hashString = generateRawResultForHash(result);

            // Assert
            expect(hashString).toBe(`{${ranks[1]}${suits[3]} ${ranks[12]}${suits[2]}}`);
        });
    });
});
