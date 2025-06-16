import { Core } from "sc-game-base";
import RoundResultPublisher from "../../../src/event-publishers/round-result-publisher";
import GameData from "../../../src/game-data";

describe("RoundResultPublisher", () => {
    let publisher: RoundResultPublisher;
    let mockGameData: GameData;
    let mockSocket1: any;
    let mockSocket2: any;

    beforeEach(() => {
        // Arrange
        mockSocket1 = { emit: jest.fn() };
        mockSocket2 = { emit: jest.fn() };

        mockGameData = {
            viewPlayers: {
                player1: mockSocket1,
                player2: mockSocket2,
            },
        } as any;

        publisher = new RoundResultPublisher("testGame", mockGameData);

        // Mock the parent class's publishToAllUsers method
        jest.spyOn(Core.BaseEventPublishers.RoundResultPublisher.prototype, "publishToAllUsers").mockImplementation();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("publishToAllUsers", () => {
        it("should call parent class publishToAllUsers method", () => {
            // Arrange
            const payload = { roundResult: "test" };

            // Act
            publisher.publishToAllUsers(payload);

            // Assert
            expect(Core.BaseEventPublishers.RoundResultPublisher.prototype.publishToAllUsers).toHaveBeenCalledWith(payload);
        });

        it("should emit event to all connected view players", () => {
            // Arrange
            const payload = { roundResult: "test" };

            // Act
            publisher.publishToAllUsers(payload);

            // Assert
            expect(mockSocket1.emit).toHaveBeenCalledWith("testGame", payload);
            expect(mockSocket2.emit).toHaveBeenCalledWith("testGame", payload);
        });

        it("should handle null sockets gracefully", () => {
            // Arrange
            const payload = { roundResult: "test" };
            mockGameData.viewPlayers = {
                player1: null,
                player2: mockSocket2,
            };

            // Act
            publisher.publishToAllUsers(payload);

            // Assert
            expect(mockSocket2.emit).toHaveBeenCalledWith("testGame", payload);
            // Should not throw error for null socket
        });
    });
});
