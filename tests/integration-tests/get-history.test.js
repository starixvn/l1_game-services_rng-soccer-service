import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import { startService } from "./_stubs/test-jobs";
import { getProcessId, buildConfigs, initUserSession, checkConnect } from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = { botenabled: false };
startService(processId, overrideGameConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when get history", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should return history", (done) => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        client.handleSignedInEvent(() => {
            client.sendInGameEvent();
        });
        const expectedData = [
            {
                home: 10,
                away: 0,
                draw: 100,
                freeBet: false,
                name: "NormalUser",
                odds: { home: 1.97, away: 1.97 },
                rate: 1,
                betLogDetails: [{ choice: "home", amount: 100, rebet: false, rate: 1, roundId: 1190120 }],
                roundId: 1190120,
                phien: 1190120,
                totalAmount: 110,
            },
            {
                home: 102,
                away: 0,
                draw: 12,
                freeBet: false,
                name: "NormalUser",
                odds: { home: 1.97, away: 1.97 },
                rate: 1,
                betLogDetails: [],
                roundId: 1190119,
                phien: 1190119,
                totalAmount: 114,
            },
        ];

        client.on(socketOptions.gameName, (inGameData) => {
            if (inGameData.remainingTime) {
                setTimeout(() => {
                    // Act
                    client.sendGetHistoryEvent();

                    // Assert
                    client.on(socketOptions.gameName, (data) => {
                        if (data.history) {
                            const actualBetLogs = data.history.betLogs.map((betLog) => {
                                delete betLog.result;
                                delete betLog.settlementResult;
                                delete betLog.betwin;
                                return betLog;
                            });

                            expect(actualBetLogs).toEqual(expectedData);
                            expect(data.history.total).toBeGreaterThan(0);
                            expect(data.history.page).toBe(1);
                            expect(data.history.pageSize).toBe(8);

                            client.close();
                            done();
                        }
                    });
                }, 1000);
            }
        });
    });
});
