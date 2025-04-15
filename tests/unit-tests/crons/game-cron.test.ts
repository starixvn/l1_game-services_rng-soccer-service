import { GameCron } from "../../../src/crons/game-cron";
import { getRandomMatch } from "../../../src/helpers/match-helper";
import GameData from "../../../src/game-data";

// Mock dependencies
jest.mock("../../../src/helpers/match-helper");
jest.mock("sc-game-base/src/core/crons");

describe("GameCron", () => {
    let gameCron: GameCron;
    let mockGameData: GameData;

    beforeEach(() => {
        // Arrange
        mockGameData = {
            roundId: 1,
            match: null,
        } as any;

        gameCron = new GameCron({} as any);
        gameCron.gameData = mockGameData;

        // Reset mocks
        jest.clearAllMocks();
        (getRandomMatch as jest.Mock).mockReturnValue({ home: "Team A", away: "Team B" });
    });

    describe("getSettingForNewRound", () => {
        it("should update match when roundId = 1", async () => {
            // Arrange
            mockGameData.roundId = 1; // MATCH_UPDATE_INTERVAL(10) * 1 + 1

            // Act
            await gameCron.getSettingForNewRound();

            // Assert
            expect(getRandomMatch).toHaveBeenCalledTimes(1);
            expect(mockGameData.match).toEqual({ home: "Team A", away: "Team B" });
        });

        it("should update match when roundId is multiple of interval plus 1", async () => {
            // Arrange
            mockGameData.roundId = 11; // MATCH_UPDATE_INTERVAL(10) * 1 + 1
            mockGameData.match = { home: "Existing Home", away: "Existing Away" };

            // Act
            await gameCron.getSettingForNewRound();

            // Assert
            expect(getRandomMatch).toHaveBeenCalledTimes(1);
            expect(mockGameData.match).toEqual({ home: "Team A", away: "Team B" });
        });

        it("should update match when current match has no home team", async () => {
            // Arrange
            mockGameData.roundId = 5;
            mockGameData.match = { home: "", away: "" } as any;

            // Act
            await gameCron.getSettingForNewRound();

            // Assert
            expect(getRandomMatch).toHaveBeenCalledTimes(1);
            expect(mockGameData.match).toEqual({ home: "Team A", away: "Team B" });
        });

        it("should not update match when roundId is not multiple of interval plus 1 and match exists", async () => {
            // Arrange
            mockGameData.roundId = 5;
            mockGameData.match = { home: "Existing Home", away: "Existing Away" };

            // Act
            await gameCron.getSettingForNewRound();

            // Assert
            expect(getRandomMatch).not.toHaveBeenCalled();
            expect(mockGameData.match).toEqual({ home: "Existing Home", away: "Existing Away" });
        });
    });
});
