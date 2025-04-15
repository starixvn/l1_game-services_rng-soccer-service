import { stub } from "jest-auto-stub";
import InGameConsumer from "../../../src/consumers/in-game-consumer";
import { InGameConsumer as InGameConsumerBase } from "sc-game-base/src/core/event-consumers";
import GameData from "../../../src/game-data";
import GameManagementApiClientFactory from "sc-game-base/src/core/game-management-api";

describe("InGameConsumer", () => {
    let consumer: InGameConsumer;
    let mockGameData: Partial<GameData>;
    let mockPublisher: { publishToUser: jest.Mock };
    let mockRealPlayer: { UID: string; socketClient: { emit: jest.Mock } };
    const gameManagementApiClientFactory = stub<GameManagementApiClientFactory>();

    beforeEach(() => {
        // Arrange common test setup
        mockPublisher = { publishToUser: jest.fn() };
        mockGameData = {
            match: { home: "team1", away: "team2" },
            remainingTime: 300,
            gameConfigs: { enabled: true } as any,
            umMessages: ["test message"] as any,
        };
        mockRealPlayer = {
            UID: "player-123",
            socketClient: { emit: jest.fn() },
        };

        consumer = new InGameConsumer(
            {} as any,
            mockGameData as GameData,
            {} as any,
            mockPublisher as any,
            null,
            gameManagementApiClientFactory
        );
        InGameConsumerBase.prototype.buildPayload = jest.fn();
    });

    describe("buildPayload", () => {
        it("should extend base payload with match data", async () => {
            // Arrange
            const basePayload = { base: "data" };
            (InGameConsumerBase.prototype.buildPayload as jest.Mock).mockResolvedValue(basePayload);

            // Act
            const result = await consumer.buildPayload(mockRealPlayer);

            // Assert
            expect(result).toEqual({
                ...basePayload,
                match: mockGameData.match,
            });
            expect(InGameConsumerBase.prototype.buildPayload).toHaveBeenCalledWith(mockRealPlayer);
        });
    });

    describe("consume", () => {
        it("should emit disabled state when game configs are disabled", async () => {
            // Arrange
            mockGameData.gameConfigs = { enabled: false } as any;

            // Act
            await consumer.consume(mockRealPlayer);

            // Assert
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(consumer.definition.name, {
                remainingTime: mockGameData.remainingTime,
                um: true,
                um_message: mockGameData.umMessages,
            });
        });

        it("should handle undefined gameConfigs as disabled state", async () => {
            // Arrange
            mockGameData.gameConfigs = undefined;

            // Act
            await consumer.consume(mockRealPlayer);

            // Assert
            expect(mockRealPlayer.socketClient.emit).toHaveBeenCalledWith(consumer.definition.name, {
                remainingTime: mockGameData.remainingTime,
                um: true,
                um_message: mockGameData.umMessages,
            });
        });

        it("should publish payload to user when game configs are enabled", async () => {
            // Arrange
            const mockPayload = { data: "test" };
            jest.spyOn(consumer, "buildPayload").mockResolvedValue(mockPayload as any);

            // Act
            await consumer.consume(mockRealPlayer);

            // Assert
            expect(mockPublisher.publishToUser).toHaveBeenCalledWith(mockRealPlayer.UID, mockPayload);
            expect(mockRealPlayer.socketClient.emit).not.toHaveBeenCalled();
        });
    });
});
