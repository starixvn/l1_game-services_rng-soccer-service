import { Socket } from "socket.io";
import { GameDefinition } from "sc-game-base/src/core";
import ViewConsumer from "../../../src/consumers/view-consumer";
import GameData from "../../../src/game-data";
import { RoundQuery } from "../../../src/query-apis";

describe("ViewConsumer", () => {
    let mockSocket: jest.Mocked<Socket>;
    let mockGameDefinition: GameDefinition;
    let mockGameData: GameData;
    let mockRoundQuery: jest.Mocked<RoundQuery>;
    let viewConsumer: ViewConsumer;

    beforeEach(() => {
        // Arrange common test setup
        mockSocket = {
            emit: jest.fn(),
        } as any;

        mockGameDefinition = {
            name: "testGame",
            numberOfRoundHistory: 5,
        } as GameDefinition;

        mockGameData = {
            remainingTime: 30,
            gameConfigs: {
                enabled: true,
                odds: [1.5, 2.0],
                originalOdds: [1.5, 2.0],
                enableFreeBet: true,
                boostedChoices: [1],
            },
            totalBets: { "1": 100 },
            roundId: "round123",
            match: { id: "match1" },
        } as any;

        mockRoundQuery = {
            getList: jest.fn(),
        } as any;

        viewConsumer = new ViewConsumer(mockGameDefinition, mockGameData, mockRoundQuery);
    });

    describe("consume", () => {
        test("should emit disabled state when game configs are not enabled", async () => {
            // Arrange
            const clientId = "client1";
            mockGameData.gameConfigs.enabled = false;
            mockGameData.umMessages = ["Maintenance"] as any;

            // Act
            await viewConsumer.consume(mockSocket, clientId);

            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith("testGame", {
                remainingTime: 30,
                um: true,
                um_message: ["Maintenance"],
            });
        });

        test("should emit disabled state when delay start time is greater than 0", async () => {
            // Arrange
            const clientId = "client1";
            mockGameData.delayStartTime = 5;

            // Act
            await viewConsumer.consume(mockSocket, clientId);

            // Assert
            expect(mockSocket.emit).toHaveBeenCalledWith("testGame", {
                remainingTime: 30,
                um: true,
                um_message: undefined,
            });
        });

        test("should emit game payload when game is enabled", async () => {
            // Arrange
            const clientId = "client1";
            const mockRoundHistory = [{ id: "round1" }];
            mockRoundQuery.getList.mockResolvedValue(mockRoundHistory);

            // Act
            await viewConsumer.consume(mockSocket, clientId);

            // Assert
            expect(mockRoundQuery.getList).toHaveBeenCalledWith(5);
            expect(mockSocket.emit).toHaveBeenCalledWith("testGame", {
                [clientId]: {
                    remainingTime: 30,
                    roundId: "round123",
                    gameConfigs: {
                        odds: [1.5, 2.0],
                        originalOdds: [1.5, 2.0],
                        enableFreeBet: true,
                        boostedChoices: [1],
                    },
                    roundHistory: mockRoundHistory,
                    ownBets: {},
                    totalBets: { "1": 100 },
                    match: { id: "match1" },
                },
            });
        });
    });

    describe("buildPayload", () => {
        test("should build payload with correct structure", async () => {
            // Arrange
            const mockRoundHistory = [{ id: "round1" }];
            mockRoundQuery.getList.mockResolvedValue(mockRoundHistory);

            // Act
            const payload = await viewConsumer.buildPayload();

            // Assert
            expect(payload).toEqual({
                remainingTime: 30,
                roundId: "round123",
                gameConfigs: {
                    odds: [1.5, 2.0],
                    originalOdds: [1.5, 2.0],
                    enableFreeBet: true,
                    boostedChoices: [1],
                },
                roundHistory: mockRoundHistory,
                ownBets: {},
                totalBets: { "1": 100 },
                match: { id: "match1" },
            });
            expect(mockRoundQuery.getList).toHaveBeenCalledWith(5);
        });
    });
});
