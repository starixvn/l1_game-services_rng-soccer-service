import { Core } from "sc-game-base";
import TableGameDefinition from "sc-game-base/src/table/table-game-definition";
import { initAPIStub, stubUserService, subGameManagementService } from "sc-game-service-integration-utils";
import appConfigs from "../../../build/app-configs.IGT";
import CoinTossContainerRegistry from "../../../build/coin-toss-container-registry";
import GameData from "../../../build/game-data";
import helpers from "../../../build/helpers";
import gameSettings from "../_stubs/game-settings";

export const run = async () => {
    initAPIStub(appConfigs.apiSettings.apiUrl);
    const definition = new TableGameDefinition(
        gameSettings,
        helpers.resultHelper.generateResult,
        helpers.resultHelper.getSettlementResult,
        helpers.resultHelper.generateRawResultForHash
    );
    const gameData = new GameData(gameSettings.durations.wholeRound);
    stubUserService(appConfigs);
    subGameManagementService(appConfigs, definition);
    const container = new CoinTossContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
};

run();
