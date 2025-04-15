import { Socket } from "socket.io";
import BaseViewRouter from "../../../src/routers/base-view-router";
import GameData from "../../../src/game-data";
import ViewConsumer from "../../../src/consumers/view-consumer";

describe("BaseViewRouter", () => {
    // Test setup
    let mockSocket: jest.Mocked<Socket>;
    let mockGameData: GameData;
    let mockLogService: any;
    let mockViewConsumer: jest.Mocked<ViewConsumer>;
    let router: BaseViewRouter;

    beforeEach(() => {
        // Arrange
        mockSocket = {
            id: "test-socket-id",
            on: jest.fn(),
        } as unknown as jest.Mocked<Socket>;

        mockGameData = {
            viewPlayers: {},
        } as GameData;

        mockLogService = {
            logError: jest.fn(),
        };

        mockViewConsumer = {
            consume: jest.fn(),
        } as unknown as jest.Mocked<ViewConsumer>;

        router = new BaseViewRouter({
            gameData: mockGameData,
            logService: mockLogService,
            viewConsumer: mockViewConsumer,
        });
    });

    describe("init", () => {
        it("should register socket event listeners", () => {
            // Act
            router.init(mockSocket);

            // Assert
            expect(mockSocket.on).toHaveBeenCalledWith("inGame", expect.any(Function));
            expect(mockSocket.on).toHaveBeenCalledWith("disconnect", expect.any(Function));
        });
    });

    describe("handleInGame", () => {
        beforeEach(() => {
            router.init(mockSocket);
        });

        it("should add socket client to viewPlayers and consume view", async () => {
            // Arrange
            const payload = { id: "test-game-id" };

            // Act
            await router.handleInGame(payload);

            // Assert
            expect(mockGameData.viewPlayers[mockSocket.id]).toBe(mockSocket);
            expect(mockViewConsumer.consume).toHaveBeenCalledWith(mockSocket, payload.id);
        });

        it("should initialize viewPlayers if undefined", async () => {
            // Arrange
            const payload = { id: "test-game-id" };
            mockGameData.viewPlayers = {};

            // Act
            await router.handleInGame(payload);

            // Assert
            expect(mockGameData.viewPlayers).toBeDefined();
            expect(mockGameData.viewPlayers[mockSocket.id]).toBe(mockSocket);
        });

        it("should handle errors and log them", async () => {
            // Arrange
            const error = new Error("Test error");
            mockViewConsumer.consume.mockRejectedValue(error);

            // Act
            await router.handleInGame({ id: "test-game-id" });

            // Assert
            expect(mockLogService.logError).toHaveBeenCalledWith(error);
        });
    });

    describe("handleDisconnect", () => {
        beforeEach(() => {
            router.init(mockSocket);
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        it("should remove socket client from viewPlayers after timeout", () => {
            // Arrange
            mockGameData.viewPlayers[mockSocket.id] = mockSocket;

            // Act
            router.handleDisconnect();
            jest.runAllTimers();

            // Assert
            expect(mockGameData.viewPlayers[mockSocket.id]).toBeUndefined();
        });
    });

    describe("verify", () => {
        it("should return true by default", () => {
            // Act
            const result = router.verify();

            // Assert
            expect(result).toBe(true);
        });
    });
});
