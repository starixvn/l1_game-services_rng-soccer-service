import { TableGameData } from "sc-game-base/src/table";
import { Match } from "./constants";

export default class GameData extends TableGameData {
    constructor(remainingTime: number) {
        super(remainingTime);
        this.viewPlayers = {};
    }
    viewPlayers: Record<string, any> = {};
    match: Match = { home: "", away: "" };
}
