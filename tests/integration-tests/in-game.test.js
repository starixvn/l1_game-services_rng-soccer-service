import { GameClientDriver, normalUser } from "sc-game-service-integration-utils";
import gameSettings from "./_stubs/game-settings";
import { startService } from "./_stubs/test-jobs";
import {
    getProcessId,
    buildConfigs,
    getTimeOutToPlacingBetTime,
    getTimeOutToSettleTime,
    initUserSession,
    checkConnect,
} from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = { botenabled: false };
const overrideAppConfigs = { enabledBoostedOdds: false };
startService(processId, overrideGameConfigs, overrideAppConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("when user joins game", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should return game configs", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.gameConfigs) {
                expect(inGameData.gameConfigs.minBet).toEqual(1);
                expect(inGameData.gameConfigs.maxBet).toEqual(3000);
                expect(inGameData.gameConfigs.maxBetPerChoices).toStrictEqual({
                    home: 3000,
                    away: 3000,
                    draw: 3000,
                });
                expect(inGameData.gameConfigs.odds).toStrictEqual({
                    home: 1.97,
                    away: 1.97,
                    draw: 3.76,
                });

                normalUserClientDriver.close();
                done();
            }
        });
    });

    it("should return user info", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.user?.UID) {
                expect(inGameData.user).toStrictEqual({
                    UID: 1,
                    avatarId: 1,
                    currency: "$US",
                    name: "NormalUser",
                    rate: 1,
                    red: 25000,
                    type: false,
                });

                normalUserClientDriver.close();
                done();
            }
        });
    });

    it("should return round history", (done) => {
        // Arrange
        const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

        // Act
        normalUserClientDriver.handleSignedInEvent(() => {
            normalUserClientDriver.sendInGameEvent();
        });

        // Assert
        normalUserClientDriver.handleInGameEvent((inGameData) => {
            if (inGameData?.roundHistory) {
                expect(inGameData.roundHistory.length).toBeGreaterThan(0);

                normalUserClientDriver.close();
                done();
            }
        });
    });

    describe("when join game in placing bet time", () => {
        it("should return resultHash with hashValue", (done) => {
            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData.remainingTime) {
                    const timeout = getTimeOutToPlacingBetTime(inGameData.remainingTime, gameSettings.durations) * 1000;
                    setTimeout(() => {
                        normalUserClientDriver.sendInGameEvent();
                    }, timeout);
                }
            });

            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData.gameConfigs && inGameData.resultHash) {
                    expect(inGameData.resultHash.hashValue).not.toBeEmpty();

                    normalUserClientDriver.close();
                    done();
                }
            });
        });
    });

    describe("when join game in settle time", () => {
        it("should return resultHash with rawValue", (done) => {
            // Arrange
            const normalUserClientDriver = new GameClientDriver(socketOptions, initUserSession(normalUser));

            // Act
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData.remainingTime) {
                    const timeout = getTimeOutToSettleTime(inGameData.remainingTime, gameSettings.durations) * 1000;
                    setTimeout(() => {
                        normalUserClientDriver.sendInGameEvent();
                    }, timeout);
                }
            });

            // Assert
            normalUserClientDriver.handleInGameEvent((inGameData) => {
                if (inGameData.gameConfigs && inGameData.resultHash) {
                    expect(inGameData.resultHash.rawValue).not.toBeEmpty();

                    normalUserClientDriver.close();
                    done();
                }
            });
        });
    });
});
