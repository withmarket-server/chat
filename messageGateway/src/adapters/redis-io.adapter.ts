import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { Cluster, SentinelConnector } from "ioredis";

const redisPort = process.env.REDIS_PORT || 6379
const redisHost = process.env.REDIS_HOST || 'localhost'

// // 클러스터
// const redisCluster = JSON.parse(process.env.REDIS_CLUSTER);
// const pubClient = new Cluster(redisCluster);

// // 센티넬
// const redisSentinel = { sentinels: JSON.parse(process.env.REDIS_SENTINEL), name: 'master01' };
// const pubClient = new SentinelConnector(options);


export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: `redis://${redisHost}:${redisPort}` });
    const subClient = pubClient.duplicate();

    pubClient.on('error', (err) => {
			console.error(`REDIS ADAPTOR DISCONNECTED ON ${redisHost}:${redisPort} pubClient`, err)
		})
		subClient.on('error', (err) => {
			console.error(`REDIS ADAPTOR DISCONNECTED ON ${redisHost}:${redisPort} subClient`, err)
		})

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient, {
			publishOnSpecificResponseChannel: true,
			requestsTimeout: 10000,
		})
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}