import { asClass, asValue } from "awilix";
import { ContainerRegistry as ContainerRegistryBase } from "sc-game-base/src/core";
import { GameCron } from "./crons/game-cron";
import { InGameConsumer, PlaceBetConsumer, SettleGameRoundConsumer } from "./consumers";
import GameStatusPublisher from "./event-publishers/game-status-publisher";
import { betLogs, bets, rounds } from "./models/index";
import { RoundQuery, HistoryQuery } from "./query-apis";

export default class ContainerRegistry extends ContainerRegistryBase {
    registerPublishers() {
        super.registerPublishers();
        this.container.register({
            gameStatusPublisher: asClass(GameStatusPublisher).singleton(),
        });
    }

    registerModels() {
        super.registerModels();

        this.container.register({
            roundsRepository: asValue(rounds),
            betsRepository: asValue(bets),
            betLogsRepository: asValue(betLogs),
            tempBetsRepository: asValue(undefined),
        });
    }

    registerConsumers() {
        super.registerConsumers();

        this.container.register({
            inGameConsumer: asClass(InGameConsumer).singleton(),
            placeBetConsumer: asClass(PlaceBetConsumer).singleton(),
            settleGameRoundConsumer: asClass(SettleGameRoundConsumer).singleton().proxy(),
        });
    }

    registerCrons() {
        super.registerCrons();

        this.container.register({
            bot: asValue(undefined),
            gameCron: asClass(GameCron).singleton().proxy(),
        });
    }

    registerApis() {
        super.registerApis();

        this.container.register({
            roundQuery: asClass(RoundQuery).singleton(),
            historyQuery: asClass(HistoryQuery).singleton(),
        });
    }
}
