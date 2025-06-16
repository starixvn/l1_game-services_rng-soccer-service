import { TEAMS, getRandomMatch } from "../../../src/helpers/match-helper";
import { Match } from "../../../src/constants";

describe("Match Helper", () => {
    describe("getRandomMatch", () => {
        test("should return a match with different home and away teams", () => {
            // Arrange/Act
            const match = getRandomMatch();

            // Assert
            expect(match.home).not.toBe(match.away);
            expect(TEAMS).toContain(match.home);
            expect(TEAMS).toContain(match.away);
        });

        test("should generate different matches across multiple calls", () => {
            // Arrange
            const matchCount = 100;
            const matches: Match[] = [];

            // Act
            for (let i = 0; i < matchCount; i++) {
                matches.push(getRandomMatch());
            }

            // Assert
            const uniqueMatches = new Set(matches.map((match) => `${match.home}-${match.away}`));
            expect(uniqueMatches.size).toBeGreaterThan(1);
        });

        test("should use teams only from the TEAMS array", () => {
            // Arrange
            const matchCount = 100;

            // Act
            const matches = Array.from({ length: matchCount }, () => getRandomMatch());

            // Assert
            matches.forEach((match) => {
                expect(TEAMS).toContain(match.home);
                expect(TEAMS).toContain(match.away);
            });
        });
    });
});
