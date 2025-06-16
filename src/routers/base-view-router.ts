import { Socket } from "socket.io";
import GameData from "../game-data";
import ViewConsumer from "../consumers/view-consumer";

export default class BaseViewRouter {
    private readonly gameData: GameData;
    private readonly logService: any;
    private readonly viewConsumer: any;
    private socketClient: Socket | undefined;

    constructor({ gameData, logService, viewConsumer }: { gameData: GameData; logService: unknown; viewConsumer: ViewConsumer }) {
        this.gameData = gameData;
        this.logService = logService;
        this.viewConsumer = viewConsumer;
    }

    init(socketClient: Socket) {
        this.socketClient = socketClient;
        this.socketClient.on("inGame", this.handleInGame.bind(this));
        this.socketClient.on("disconnect", this.handleDisconnect.bind(this));
    }

    async handleInGame(payload: { id: string }) {
        try {
            if (!this.verify() || !this.socketClient) {
                return;
            }

            if (!this.gameData.viewPlayers) {
                this.gameData.viewPlayers = {};
            }

            this.gameData.viewPlayers[this.socketClient.id] = this.socketClient;
            await this.viewConsumer.consume(this.socketClient, payload?.id);
        } catch (error) {
            this.logService.logError(error);
        }
    }

    handleDisconnect() {
        try {
            setTimeout(() => {
                this.socketClient && delete this.gameData.viewPlayers[this.socketClient.id];
            });
        } catch (error) {
            this.logService.logError(error);
        }
    }

    verify() {
        return true;
    }
}
