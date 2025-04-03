export default {
    id: 118,
    name: "RNGSoccer",
    durations: {
        wholeRound: 41,
        placingBets: 30,
        lockingBet: 3,
        dealCards: 2,
    },
    choices: ["home", "away", "draw"],
    choicesMapper: { home: 1, away: 2, draw: 3 },
    hedgeBetGroups: [["home", "away"]],
    numberOfRoundHistory: 102,
};
