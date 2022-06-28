"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_1 = require("redis");
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || 'localhost';
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    async connectToRedis() {
        const pubClient = (0, redis_1.createClient)({ url: `redis://${redisHost}:${redisPort}` });
        const subClient = pubClient.duplicate();
        pubClient.on('error', (err) => {
            console.error(`REDIS ADAPTOR DISCONNECTED ON ${redisHost}:${redisPort} pubClient`, err);
        });
        subClient.on('error', (err) => {
            console.error(`REDIS ADAPTOR DISCONNECTED ON ${redisHost}:${redisPort} subClient`, err);
        });
        await Promise.all([pubClient.connect(), subClient.connect()]);
        this.adapterConstructor = (0, redis_adapter_1.createAdapter)(pubClient, subClient, {
            publishOnSpecificResponseChannel: true,
            requestsTimeout: 10000,
        });
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, options);
        server.adapter(this.adapterConstructor);
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map