import { createClient } from 'redis'

export const createRedisClient = (autoConnect) => {
    const redisClient = createClient({
        socket: {
            host: '0.0.0.0',
            port: 4000
        }
    })
    redisClient.on('error', (err) => {
        console.log('Could not connect to redis', err);
    })
    redisClient.on('connect', () => {
        console.log('Connected to redis');
    })
    if (autoConnect) {
        redisClient.connect() 
    }
    return redisClient
}