const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const suits = ["♥", "♦", "♣", "♠"];

const cards: Card[] = ranks.flatMap((_, index) => suits.map((_, suitIndex) => ({ rank: index, suit: suitIndex })));

export type Card = {
    rank: number;
    suit: number;
};

export { cards, ranks, suits };
