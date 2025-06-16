import { BET_CHOICES } from "./constants";

export type Duration = {
    wholeRound: number;
    placingBets: number;
    lockingBet: number;
    dealCards: number;
};

export default {
    id: 118,
    name: "RNGSoccer",
    durations: {
        wholeRound: 20,
        placingBets: 15,
        lockingBet: 3,
        dealCards: 1,
    },
    choices: Object.values(BET_CHOICES),
    choicesMapper: { home: 1, away: 2, draw: 3 },
    hedgeBetGroups: [[BET_CHOICES.home, BET_CHOICES.away]],
    numberOfRoundHistory: 100,
    provablyFair: false,
};
