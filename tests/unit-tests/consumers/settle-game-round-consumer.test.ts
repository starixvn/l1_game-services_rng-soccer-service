import SettleGameRoundConsumer from "../../../src/consumers/settle-game-round-consumer";
import { BET_CHOICES } from "../../../src/constants";
import { stub } from "jest-auto-stub";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";

describe("SettleGameRoundConsumer", () => {
    let consumer: SettleGameRoundConsumer;
    let mockRoundsRepository: any;
    let mockRoundResultPublisher: any;
    let mockDefinition: any;
    const gameManagementApiClientFactory = stub<GameManagementApiClientFactory>();

    beforeEach(() => {
        mockRoundsRepository = {
            create: jest.fn(),
        };
        mockRoundResultPublisher = {
            publishRoundResult: jest.fn(),
            publishWinners: jest.fn(),
        };
        mockDefinition = {
            settle: jest.fn(),
            generateResult: jest.fn(),
            choices: [BET_CHOICES.home, BET_CHOICES.away, BET_CHOICES.draw],
        };

        consumer = new SettleGameRoundConsumer({
            definition: mockDefinition,
            roundsRepository: mockRoundsRepository,
            roundResultPublisher: mockRoundResultPublisher,
            gameManagementApiClientFactory,
        } as any);
    });

    describe("settleRound", () => {
        it("should create new round and publish results when round creation succeeds", async () => {
            // Arrange
            const mockResult = "RESULT";
            const mockSettlementResult = { home: true, away: false };
            const mockGameData = {
                roundId: 1,
                exchangeRates: { exId: "EX123" },
                match: "MATCH1",
                winningPlayers: ["player1"],
            } as any;

            consumer.gameData = mockGameData;
            consumer.generateResult = jest.fn().mockReturnValue(mockResult);
            mockDefinition.settle.mockReturnValue(mockSettlementResult);
            mockRoundsRepository.create.mockResolvedValue({
                id: 1,
                time: new Date(),
            });
            consumer.settleBets = jest.fn();

            // Act
            await consumer.settleRound();

            // Assert
            expect(mockRoundsRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 1,
                    result: mockResult,
                    settlementResult: mockSettlementResult,
                })
            );
            expect(mockRoundResultPublisher.publishRoundResult).toHaveBeenCalled();
            expect(mockRoundResultPublisher.publishWinners).toHaveBeenCalledWith(1, ["player1"]);
            expect(consumer.gameData.roundId).toBe(2);
        });
    });

    describe("generateResult", () => {
        it("should return admin result when roundId matches", () => {
            // Arrange
            const mockAdminResult = "ADMIN_RESULT";
            consumer.gameData = {
                roundId: 1,
                settlementResultFromAdmin: {
                    roundId: 1,
                    result: mockAdminResult,
                },
            } as any;

            // Act
            const result = consumer.generateResult();

            // Assert
            expect(result).toBe(mockAdminResult);
        });

        it("should generate new result when roundId does not match admin result", () => {
            // Arrange
            const mockGeneratedResult = "GENERATED_RESULT";
            consumer.gameData = {
                roundId: 2,
                settlementResultFromAdmin: {
                    roundId: 1,
                    result: "ADMIN_RESULT",
                },
                gameConfigs: {
                    randomMode: 2,
                },
            } as any;
            mockDefinition.generateResult.mockReturnValue(mockGeneratedResult);

            // Act
            const result = consumer.generateResult();

            // Assert
            expect(result).toBe(mockGeneratedResult);
            expect(mockDefinition.generateResult).toHaveBeenCalledWith(2);
        });
    });

    describe("calculateBetResult", () => {
        it("should calculate correct win amounts for winning bets", () => {
            // Arrange
            const settlementResult = { home: true, away: false, draw: false };
            const bet = { home: 100, away: 50 };
            const odds = { home: 2.0, away: 1.5 };

            // Act
            const result = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(result).toEqual({
                totalBetAmount: 150,
                totalWin: 200,
                netWin: 100,
                totalLost: 50,
                winningByChoices: {
                    home: 200,
                    away: 0,
                    draw: 0,
                },
            });
        });

        it("should handle draw result with refund calculation", () => {
            // Arrange
            const settlementResult = { home: false, away: false, draw: true };
            const bet = { home: 100, draw: 100 };
            const odds = { home: 2.0, away: 2.0, draw: 3.0 };

            // Act
            const result = consumer.calculateBetResult(settlementResult, bet, odds);

            // Assert
            expect(result).toEqual({
                totalBetAmount: 200,
                totalWin: 350,
                netWin: 200,
                totalLost: 100,
                winningByChoices: {
                    home: 0,
                    away: 0,
                    draw: 300,
                },
            });
        });
    });
});
