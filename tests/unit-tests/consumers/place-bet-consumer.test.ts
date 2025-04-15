import Chance from "chance";
import { helpers } from "sc-common";
import { Core } from "sc-game-base";

import PlaceBetConsumer from "../../../src/consumers/place-bet-consumer";
import { stub } from "jest-auto-stub";

describe("composeBettingTimeValidationCriteria tests", () => {
    const playerName = "nhanvat01";
    const player = {
        UID: "123",
        profile: {
            name: playerName,
            minBet: 1,
            maxBet: 500,
        },
        session: {
            currency: "US",
        },
    };

    const chance = new Chance();

    const gameData = {
        ingame: {
            [playerName]: {
                name: player.profile.name,
                betTracks: {},
                betQueue: [],
            },
        },
        remainingTime: 20,
        gameConfigs: {
            enabled: true,
            minbet: 1,
            maxbet: 1000,
            choices_maxbet: {
                choice01: 200,
            },
        },
        roundId: 1,
    } as any;

    const gameDefinition = {
        choices: ["choice01"],
        durations: {
            wholeRound: 20,
            placingBets: 15,
            lockingBet: 3,
            dealCards: 1,
        },
    } as any;
    const publisher = stub<Core.BaseEventPublishers.BaseEventPublisher>();

    describe("when game was disabled", () => {
        it("should return placeBetNextRound notice", () => {
            // arrange
            gameData.gameConfigs.enabled = false;
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
            });
        });
    });

    describe("when bet comes in settlement time", () => {
        it("should return cannotPlaceBet notice", () => {
            // arrange
            gameData.gameConfigs.enabled = true;
            gameData.remainingTime = chance.integer({
                min: gameDefinition.durations.placingBets,
                max: gameDefinition.durations.placingBets + gameDefinition.durations.dealCards,
            });
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.cannotPlaceBet },
            });
        });
    });

    describe("when bet comes in locking bet time", () => {
        it("should return placeBetNextRound notice", () => {
            // arrange
            gameData.gameConfigs.enabled = true;
            gameData.remainingTime = chance.integer({
                min: 0,
                max: gameDefinition.durations.lockingBet - 1,
            });
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
            });
        });
    });

    describe("when bet comes in dealing cards time", () => {
        it("should return placeBetNextRound notice", () => {
            // arrange
            gameData.gameConfigs.enabled = true;
            gameData.remainingTime = chance.integer({
                min: gameDefinition.durations.placingBets + gameDefinition.durations.dealCards + 1,
                max: gameDefinition.durations.wholeRound,
            });
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.placeBetNextRound },
            });
        });
    });

    describe("when roundId not match running round", () => {
        it("should return placeBetNextRound notice ", () => {
            // arrange
            gameData.roundId = 2;
            gameData.gameConfigs.enabled = true;
            gameData.remainingTime = chance.integer({
                min: gameDefinition.durations.placingBets + gameDefinition.durations.dealCards + 1,
                max: gameDefinition.durations.wholeRound,
            });
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            expect(criterions.filter((x) => x.failure)[0]).toStrictEqual({
                failure: true,
                notice: { errorCode: helpers.noticeHelper.invalidBet, gameRoundId: 1 },
            });
        });
    });

    describe("when valid", () => {
        it("should not return any failures", () => {
            // arrange
            gameData.roundId = 1;
            gameData.gameConfigs.enabled = true;
            gameData.remainingTime = chance.integer({
                min: gameDefinition.durations.lockingBet,
                max: gameDefinition.durations.placingBets,
            });
            const placeBetConsumer = new PlaceBetConsumer(gameDefinition, gameData, publisher);

            // act
            const criterions = placeBetConsumer.composeBettingTimeValidationCriteria(1);

            // assert
            console.log(criterions);
            expect(criterions.filter((x) => x.failure).length).toBe(0);
        });
    });
});
