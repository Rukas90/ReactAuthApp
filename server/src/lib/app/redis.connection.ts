import IORedis from 'ioredis'

const CONNECTION = new IORedis('redis://localhost:6379')

const redis = {
    initialize: () => {
        CONNECTION.on('connect', () => {
            console.log('✅ Redis connected successfully')
        })

        CONNECTION.on('ready', () => {
            console.log('✅ Redis is ready to accept commands')
        })

        CONNECTION.on('error', (err) => {
            console.error('❌ Redis connection error:', err)
        })

        CONNECTION.on('close', () => {
            console.log('⚠️ Redis connection closed')
        })
    },
    connection: CONNECTION
}
export default redis