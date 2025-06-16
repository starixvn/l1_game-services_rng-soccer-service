import { Match } from "../constants";

export const TEAMS = [
    "LIV", // Liverpool
    "INT", // Inter Milan
    "BAR", // Barcelona
    "PSG", // Paris Saint-Germain
    "ARS", // Arsenal
    "BAY", // Bayern Munich
    "RMA", // Real Madrid
    "LEV", // Bayer Leverkusen
    "ATM", // Atletico Madrid
    "MCI", // Manchester City
    "ATA", // Atalanta
    "NAP", // Napoli
    "ATH", // Athletico Bilbao
    "AVL", // Aston Villa
    "BEN", // Benfica
    "SPO", // Sporting
    "NFO", // Nottingham Forest
    "BOL", // Bologna
    "ROM", // AS Roma
    "JUV", // Juventus
];
export const getRandomMatch = (): Match => {
    const teamsCopy = [...TEAMS];

    const randomIndex1 = Math.floor(Math.random() * teamsCopy.length); // NOSONAR
    const home = teamsCopy[randomIndex1];
    teamsCopy.splice(randomIndex1, 1);

    const randomIndex2 = Math.floor(Math.random() * teamsCopy.length); // NOSONAR
    const away = teamsCopy[randomIndex2];

    return { home, away };
};
