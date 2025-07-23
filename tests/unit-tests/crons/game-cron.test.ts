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
        it("should update match", async () => {
            // Arrange
            mockGameData.roundId = 1;

            // Act
            await gameCron.getSettingForNewRound();

            // Assert
            expect(getRandomMatch).toHaveBeenCalled();
            expect(mockGameData.match).toEqual({ home: "Team A", away: "Team B" });
        });
    });
});
