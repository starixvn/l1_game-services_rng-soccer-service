export default {
    hostingPort: 5000,
    apiSettings: {
        enabledApi: true,
        apiUrl: "http://sp_hd_game_api_sit:5000",
        authUrl: "http://sp_hd_auth_api_sit:5000",
        client: {
            id: "game-server",
            secret: "gameserver@20luminet&",
        },
        useAuthenticate: true,
        requestTimeout: 10000,
        placeBetTimeout: 2000,
        enabledApiLogs: true,
    },
    socketOptions: {
        pingInterval: 60 * 1000,
        pingTimeout: 60 * 1000,
        transports: ["websocket"],
        allowUpgrades: false,
        perMessageDeflate: false,
    },
    enabledLogs: true,
    database: {
        url: "mongodb://hotdog_backend:HotdogBackend%40517@10.99.99.53:39530,10.99.99.54:39530,10.99.99.188:39530,10.99.99.187:39530/?authSource=admin&replicaSet=SP-SIT&appName=DragonTigerFight",
        options: {
            dbName: "hotdog_minigame",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        },
    },
    sentry: {
        sentryUrl: "http://d039f2abe16b4252a70cdf60fff232b6@10.2.190.51:9009/282",
        logIdentifier: "HD-DragonTigerFight",
        env: "SIT",
    },
    authenticateSettings: {
        url: "http://sp_hd_auth_api_sit:5000",
        id: "game-services",
        secret: "gameservices@20luminet&",
        requestTimeout: 10000,
        useAuthenticate: true,
        audiences: ["api", "admin-api"],
    },
    userServiceSettings: {
        url: "http://sp_hd_user_service_sit:5000",
    },
    adminSecretKey: "asWDEerfOIdgsdqRTFabvmgh",
    metrics: {
        enable: true,
        secretKey: "6c1f0f28-70f2-46ae-b031-22624a6cd8df",
    },
    enableMsgpackParser: true,
};
