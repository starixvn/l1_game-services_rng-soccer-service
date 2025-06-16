export default {
    id: 118,
    name: "RNGSoccer",
    durations: {
        wholeRound: 20,
        placingBets: 15,
        lockingBet: 3,
        dealCards: 1,
    },
    choices: ["home", "away", "draw"],
    choicesMapper: { home: 1, away: 2, draw: 3 },
    hedgeBetGroups: [["home", "away"]],
    provablyFair: false,
};
