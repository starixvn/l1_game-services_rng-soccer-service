import { stub, stubMongooseModelStupidly } from "jest-micro-auto-stub";
import mongoose from "mongoose";
import { Core, Table } from "sc-game-base";

import Bot from "../../../src/crons/bot";
import gameSettings from "../../../src/game-settings";
import appConfigs from "../../../src/app-configs";

describe("bot test", () => {
    const definition = new Table.TableGameDefinition(gameSettings);
    const gameData = new Table.TableGameData(0);
    gameData.gameConfigs = {
        choices_maxbet: {
            home: 10000,
            away: 10000,
            draw: 500,
        },
        minbet: 1,
        bot_maxbet: 2000,
    };
    const publisher = stub(Core.BaseEventPublishers.BaseEventPublisher);

    /** @type {mongoose.Model}*/
    const tempBetsRepository = stubMongooseModelStupidly(mongoose.Model);

    /** @type {mongoose.Model}*/
    const userInfosRepository = stubMongooseModelStupidly(mongoose.Model);
    const botInstance = new Bot(definition, gameData, publisher, userInfosRepository, tempBetsRepository, appConfigs);
    const bot = {
        id: 1,
        name: "bot1",
        red: 1000,
        type: true,
        choices: [],
        remainTickets: 3,
        totalBet: 0,
    };

    it("Inherit Table.Crons.TableGameBot", () => {
        expect(botInstance instanceof Table.Crons.TableGameBot).toBeTruthy();
    });

    describe("resetAllBets", () => {
        it("Returns default values", () => {
            botInstance.smallTickets = 10;

            // act
            botInstance.resetAllBets();

            /// assert
            expect(botInstance.smallTickets).toEqual(0);
        });
    });

    describe("getBetChoice", () => {
        beforeEach(() => {
            botInstance.resetAllBotData();
        });

        it("should return home away options when they are not reached", () => {
            botInstance.allBets = {
                home: 400,
                away: 300,
                draw: 200,
            };

            const choice = botInstance.getBetChoice(bot);

            expect(botInstance.homeAwayOpts).toContain(choice);
        });

        it("should return home away options as default", () => {
            botInstance.resetAllBets();

            const choice = botInstance.getBetChoice(bot);

            expect(botInstance.homeAwayOpts).toContain(choice);
        });
    });

    describe("getMaxBet", () => {
        it("should return value between min and max bet config", () => {
            const choice = "home";
            const { bot_maxbet, minbet, choices_maxbet } = gameData.gameConfigs;
            const maxBet = Math.min(bot_maxbet, choices_maxbet[choice]);

            const actualResult = botInstance.getMaxBet(bot, choice);

            expect(actualResult).toBeWithin(minbet, maxBet);
        });
    });

    describe("updateBotInRoomData", () => {
        it("calls super.updateBotInRoomData", () => {
            // arrange
            spyOn(Table.Crons.TableGameBot.prototype, "updateBotInRoomData");

            // act
            botInstance.updateBotInRoomData(bot, "home", 10, 100);

            // assert
            expect(Table.Crons.TableGameBot.prototype.updateBotInRoomData).toHaveBeenCalled();
        });
    });

    describe("resetAllBotData", () => {
        it("Calls specific functions", () => {
            // arrange
            spyOn(Table.Crons.TableGameBot.prototype, "resetAllBotData");
            spyOn(botInstance, "resetAllBets");

            // act
            botInstance.resetAllBotData();

            // assert
            expect(Table.Crons.TableGameBot.prototype.resetAllBotData).toHaveBeenCalled();
            expect(botInstance.resetAllBets).toHaveBeenCalled();
        });
    });

    describe("shouldAddBot", () => {
        it("should add bot when botsInRoom < maxNumberOfBots and random is inOutValues", () => {
            // arrange
            botInstance.botsInRoom = { 1: {}, 2: {} };
            botInstance.maxNumberOfBots = 3;

            // act
            const result = botInstance.shouldAddBot(3);

            // assert
            expect(result).toBe(true);
        });

        it("should NOT add bot when botsInRoom >= maxNumberOfBots", () => {
            // arrange
            botInstance.botsInRoom = { 1: {}, 2: {} };
            botInstance.maxNumberOfBots = 2;

            // act
            const result = botInstance.shouldAddBot(3);

            // assert
            expect(result).toBe(false);
        });

        it("should NOT add bot when random is not inOutValues", () => {
            // arrange
            botInstance.botsInRoom = { 1: {}, 2: {} };
            botInstance.maxNumberOfBots = 3;

            // act
            const result = botInstance.shouldAddBot(4);

            // assert
            expect(result).toBe(false);
        });
    });

    describe("getBotsToBet", () => {
        it("when botsToBet < max numberBotsToBet - return all botsToBet", () => {
            // arrange
            botInstance.botsInRoom = { 1: { totalBet: 10, remainTickets: 2 }, 2: { totalBet: 11, remainTickets: 2 } };

            // act
            const result = botInstance.getBotsToBet();

            // assert
            expect(result.length).toBe(2);
        });

        it("when botsToBet > max numberBotsToBet - return max numberBotsToBet", () => {
            // arrange
            botInstance.botsInRoom = {
                1: { totalBet: 10, remainTickets: 2 },
                2: { totalBet: 11, remainTickets: 2 },
                3: { totalBet: 11, remainTickets: 2 },
                4: { totalBet: 11, remainTickets: 2 },
                5: { totalBet: 11, remainTickets: 2 },
                6: { totalBet: 11, remainTickets: 2 },
                7: { totalBet: 11, remainTickets: 2 },
            };
            botInstance.gameData.remainingTime = 10;

            // act
            const result = botInstance.getBotsToBet();

            // assert
            expect(result.length).toBe(5);
        });
    });
});
