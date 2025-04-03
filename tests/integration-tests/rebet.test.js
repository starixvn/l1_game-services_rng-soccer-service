import { GameClientDriver, normalUser, eventTypes } from "sc-game-service-integration-utils";
import gameSettings from "./_stubs/game-settings";
import { startService } from "./_stubs/test-jobs";
import {
    getProcessId,
    buildConfigs,
    getTimeOutToBetInvalid,
    getTimeOutToPlacingBetTime,
    initUserSession,
    checkConnect,
} from "./_stubs/helper";
import { socketOptionsFunc } from "./_stubs/test-data";
const path = require("path");

const scriptName = path.basename(__filename);
const processId = getProcessId(scriptName);
const overrideGameConfigs = { botenabled: false };
startService(processId, overrideGameConfigs);

const appConfigs = buildConfigs(processId);
const socketOptions = socketOptionsFunc(appConfigs.hostingPort);

describe("rebet", () => {
    it("check connect", (done) => {
        checkConnect(processId, done);
    });

    it("should return rebet data", (done) => {
        // Arrange
        const client = new GameClientDriver(socketOptions, initUserSession(normalUser));
        client.handleSignedInEvent(() => {
            client.sendInGameEvent();
        });
        let receivedRemainingTime = false;

        // Act
        client.on(socketOptions.gameName, (inGameData) => {
            if (inGameData.remainingTime && !receivedRemainingTime) {
                receivedRemainingTime = true;
                setTimeout(() => {
                    client.emit("rebet", { m: 1 });
                }, getTimeOutToPlacingBetTime(inGameData.remainingTime, gameSettings.durations) * 1000);
            }
        });

        // Assert
        client.on(socketOptions.gameName, (data) => {
            if (data.rebet) {
                expect(data.ownBets).toEqual({ home: 102, draw: 12 });

                client.close();
                done();
            }
        });
    });
});
