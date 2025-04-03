import gameSetting from "../../../src/game-settings";

const game = {
    id: gameSetting.id,
    name: gameSetting.name,
};

const currencyData = { code: "USD", name: "$US" };

const socketOptionsFunc = (port) => {
    return {
        socketUri: `http://localhost:${port}/user/${gameSetting.name.toLowerCase()}`,
        gameName: game.name,
        proxyRoute: "/socket.io",
    };
};

const gameConfig = {
    type: 0,
    name: gameSetting.name.toLowerCase(),
    minBet: 1,
    maxBet: 3000,
    maxBetPerChoices: { home: 3000, away: 3000, draw: 3000 },
    odds: { home: 1.97, away: 1.97, draw: 3.76 },
    botenabled: true,
    hour_maxbot: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    bot_maxbet: 1000,
    choices_maxbet: { player: 10000, banker: 10000, big: 10000, small: 10000, draw: 10000, playerPair: 10000, bankerPair: 10000 },
};

const roundsData = [
    {
        id: 1190119,
        result: { home: { rank: 2, suit: 1 }, away: { rank: 3, suit: 2 } },
        settlementResult: { home: true, away: false, draw: false },
        exchangeRateId: 1,
    },
    {
        id: 1190118,
        result: { home: { rank: 2, suit: 1 }, away: { rank: 3, suit: 2 } },
        settlementResult: { home: true, away: false, draw: false },
        exchangeRateId: 1,
    },
    {
        id: 1190117,
        result: { home: { rank: 2, suit: 1 }, away: { rank: 3, suit: 2 } },
        settlementResult: { home: true, away: false, draw: false },
        exchangeRateId: 1,
    },
];

const userBetData = (uid) => {
    return [
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: "1",
            name: "NormalUser",
            odds: gameConfig.odds,
            operatorId: "dummy-operator-id",
            rate: 1,
            home: 102,
            away: 0,
            draw: 12,
            siteId: "111",
            roundId: 1190119,
            paid: true,
            totalAmount: 114,
        },
        {
            freeBet: false,
            uid: uid,
            betwin: 0,
            currency: "$US",
            playerId: "4",
            name: "NormalUser",
            odd: 0,
            odds: gameConfig.odds,
            operatorId: "dummy-operator-id",
            rate: 1,
            home: 10,
            away: 0,
            siteId: "111",
            roundId: 1190120,
            paid: true,
            totalAmount: 110,
        },
    ];
};

const userBetLogData = (uid) => {
    return [
        {
            uid: uid,
            currency: "$US",
            playerId: "1",
            name: "NormalUser",
            operatorId: "dummy-operator-id",
            choice: "draw",
            amount: 100,
            rate: 1,
            siteId: "111",
            roundId: 1190120,
        },
    ];
};

const promotions = [
    {
        gameId: gameSetting.id,
        startDateTime: new Date(new Date().setSeconds(new Date().getSeconds() + 15)),
        endDateTime: new Date(new Date().setSeconds(new Date().getSeconds() + 15 + 6)),
        isDaily: false,
        odds: { home: 1.98, away: 1.98, draw: 3.7 },
        status: "enabled",
    },
];

export { game, currencyData, socketOptionsFunc, gameConfig, roundsData, userBetData, promotions, userBetLogData };
