import GameStatusPublisher from "../../../src/event-publishers/game-status-publisher";
import GameData from "../../../src/game-data";
import { Socket } from "socket.io";
import { GameStatusPublisher as GameStatusPublisherBase } from "sc-game-base/src/core/event-publishers";

describe("GameStatusPublisher", () => {
    let publisher: GameStatusPublisher;
    let mockGameData: GameData;
    let mockSocket1: jest.Mocked<Socket>;
    let mockSocket2: jest.Mocked<Socket>;

    beforeEach(() => {
        // Setup mock sockets
        mockSocket1 = {
            emit: jest.fn(),
        } as any;
        mockSocket2 = {
            emit: jest.fn(),
        } as any;

        // Setup mock game data
        mockGameData = {
            viewPlayers: {
                player1: mockSocket1,
                player2: mockSocket2,
            },
            gameConfigs: {
                odds: 1.5,
                originalOdds: 2.0,
                enableFreeBet: true,
            },
            remainingTime: 60,
            match: { home: "Team A", away: "Team B" },
            currencies: ["USD", "EUR"],
            exchangeRates: { USD: 1, EUR: 0.85 },
        } as any;

        publisher = new GameStatusPublisher("testGame", mockGameData);
        publisher.publishToAllAdmins = jest.fn();
    });

    describe("publishToAllUsers", () => {
        it("should emit payload to all view players", () => {
            // Arrange
            const testPayload = { test: "data" };
            GameStatusPublisherBase.prototype.publishToAllUsers = jest.fn();

            // Act
            publisher.publishToAllUsers(testPayload);

            // Assert
            expect(mockSocket1.emit).toHaveBeenCalledWith("testGame", testPayload);
            expect(mockSocket2.emit).toHaveBeenCalledWith("testGame", testPayload);
        });
    });

    describe("publishEnablingGameStatus", () => {
        it("should emit game configs and remaining time to all view players", () => {
            // Arrange
            const expectedPayload = {
                gameConfigs: {
                    odds: 1.5,
                    originalOdds: 2.0,
                    enableFreeBet: true,
                },
                remainingTime: 60,
                snr: true,
            };
            GameStatusPublisherBase.prototype.publishEnablingGameStatus = jest.fn();

            // Act
            publisher.publishEnablingGameStatus();

            // Assert
            expect(mockSocket1.emit).toHaveBeenCalledWith("testGame", expectedPayload);
            expect(mockSocket2.emit).toHaveBeenCalledWith("testGame", expectedPayload);
        });
    });

    describe("publishStartGame", () => {
        it("should publish game start data to all users", () => {
            // Arrange
            const expectedUserPayload = {
                remainingTime: 60,
                snr: true,
                match: { home: "Team A", away: "Team B" },
            };
            GameStatusPublisherBase.prototype.publishToAllUsers = jest.fn();

            // Act
            publisher.publishStartGame();

            // Assert
            expect(mockSocket1.emit).toHaveBeenCalledWith("testGame", expectedUserPayload);
            expect(mockSocket2.emit).toHaveBeenCalledWith("testGame", expectedUserPayload);
        });

        it("should publish admin data to all admins", () => {
            // Arrange
            const expectedAdminPayload = {
                currencies: ["USD", "EUR"],
                exchangeRates: { USD: 1, EUR: 0.85 },
                match: { home: "Team A", away: "Team B" },
            };
            publisher.publishToAllUsers = jest.fn();

            // Act
            publisher.publishStartGame();

            // Assert
            expect(publisher.publishToAllAdmins).toHaveBeenCalledWith(expectedAdminPayload);
        });
    });
});
