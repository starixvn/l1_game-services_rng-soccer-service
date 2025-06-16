import { cards, ranks, suits } from "./card";
import { Chance } from "chance";
import _ from "lodash";
import { shuffle as d3Shuffle } from "d3-array";
import { Random as RandomJS, MersenneTwister19937 } from "random-js";
import Random from "random";
import { randomInt } from "crypto";
import { Result, Card, SettlementResult } from "../constants";

const chance = new Chance();

export const mathRandom = () => {
    return Math.random(); // NOSONAR
};

const random1 = (max: number) => {
    return Math.floor(mathRandom() * max);
};

const random2 = (max: number) => {
    return chance.integer({ min: 0, max });
};

const random3 = (max: number) => {
    return Random.int(0, max);
};

const random4 = (max: number) => {
    const randomJS = new RandomJS(MersenneTwister19937.autoSeed());

    return randomJS.integer(0, max);
};

const random5 = (max: number) => {
    return randomInt(max + 1);
};

const random6 = (max: number) => {
    const seed = Math.floor(mathRandom() * 100000);
    const randomJS = new RandomJS(MersenneTwister19937.seed(seed));
    return randomJS.integer(0, max);
};

const randomFunctions: Record<number, Function[]> = {
    1: [random1, random2, random3],
    2: [random4, random5, random6],
};

const randomCustomize = (mode: number, max: number) => {
    const functions = randomFunctions[mode];
    const selectedRandomMethodIndex = Math.floor(mathRandom() * functions.length);
    const randomFunction = functions[selectedRandomMethodIndex];

    return randomFunction(max);
};

const shuffleCards = (deskOfCards: Card[]) => {
    for (let i = deskOfCards.length - 1; i >= 0; i -= 2) {
        const randomCardIndex = Math.floor(chance.floating({ min: 0, max: 1 }) * (i + 1));
        const term = deskOfCards[i];

        deskOfCards[i] = deskOfCards[randomCardIndex];
        deskOfCards[randomCardIndex] = term;
    }
};

const shuffle1 = (arr: Card[]) => {
    const deskOfCards = [...arr];

    shuffleCards(deskOfCards);
    shuffleCards(deskOfCards);
    shuffleCards(deskOfCards);

    return deskOfCards.slice(0, 2);
};

const shuffle2 = (arr: Card[]) => {
    return chance.shuffle(chance.shuffle(chance.shuffle(arr)));
};

const shuffle3 = (arr: Card[]) => {
    return d3Shuffle(d3Shuffle(d3Shuffle(arr)));
};

const shuffle4 = (arr: Card[]) => {
    let result = arr;
    const r = new RandomJS(MersenneTwister19937.autoSeed());

    for (let i = 0; i < 3; i++) {
        result = r.shuffle(arr);
    }

    return result;
};

const shuffle5 = (arr: Card[]) => {
    return _.shuffle(_.shuffle(_.shuffle(arr)));
};

const shuffleCards2 = (array: Card[], mode: number) => {
    for (let i = 0; i < 3; i++) {
        let lastElementIndex = array.length - 1;

        while (lastElementIndex) {
            const randomIndex = randomCustomize(mode, array.length - 1);
            lastElementIndex--;
            const lastElement = array[lastElementIndex];

            array[lastElementIndex] = array[randomIndex];
            array[randomIndex] = lastElement;
        }
    }
    return array;
};

const shuffle6 = (arr: Card[]) => {
    return shuffleCards2(arr, 1);
};

const shuffle7 = (arr: Card[]) => {
    return shuffleCards2(arr, 2);
};

const randomModes: Record<number, Function[]> = {
    1: [shuffle1, shuffle2, shuffle3],
    2: [shuffle4, shuffle5, shuffle6],
    3: [shuffle3, shuffle5, shuffle7],
};

const settlementRuleEntries = Object.entries({
    home: (roundResult: Result) => roundResult.home.rank > roundResult.away.rank,
    away: (roundResult: Result) => roundResult.home.rank < roundResult.away.rank,
    draw: (roundResult: Result) => roundResult.home.rank === roundResult.away.rank,
});

export const generateResult = (randomMode: number): Result => {
    const randomShuffles = randomModes[randomMode] || randomModes[1];
    const shuffle = chance.pickone(randomShuffles);
    const deck = shuffle(cards);

    return { home: deck[0], away: deck[1] };
};

export const getSettlementResult = (roundResult: Result): SettlementResult => {
    return settlementRuleEntries.reduce(
        (result: SettlementResult, [choice, rule]: [string, (roundResult: Result) => boolean]) => {
            (result as any)[choice] = rule(roundResult);

            return result;
        },
        { home: false, away: false, draw: false } as SettlementResult
    );
};

export const generateRawResultForHash = ({ home, away }: Result) => {
    return `{${ranks[home.rank]}${suits[home.suit]} ${ranks[away.rank]}${suits[away.suit]}}`;
};
