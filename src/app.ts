import { Core } from "sc-game-base";
import appConfigs from "./app-configs";
import ContainerRegistry from "./container-registry";
import GameData from "./game-data";
import gameSettings from "./game-settings";
import { resultHelper } from "./helpers";
import { registerViewModule } from "./register-view-module";

const run = async () => {
    const definition = new Core.GameDefinition(
        gameSettings,
        resultHelper.generateResult,
        resultHelper.getSettlementResult,
        resultHelper.generateRawResultForHash
    );
    const gameData = new GameData(gameSettings.durations.wholeRound);

    const container = new ContainerRegistry().register(appConfigs, definition, gameData);
    const app = new Core.BaseGameApp(gameSettings.name, appConfigs);
    await app.run();
    await app.startGame(container);
    registerViewModule(app, container, definition);
};

run();
