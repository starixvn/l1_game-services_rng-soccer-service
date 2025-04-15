export const BET_CHOICES = { home: "home", away: "away", draw: "draw" };

export type Card = {
    rank: number;
    suit: number;
};

export type Result = {
    home: Card;
    away: Card;
};

export type SettlementResult = {
    home: boolean;
    away: boolean;
    draw: boolean;
};

export type Match = {
    home: string;
    away: string;
};
