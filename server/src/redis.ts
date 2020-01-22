import Redis from 'ioredis'
import config from './config'
import log from './logger'

function connect(): Promise<Redis.Redis> {
    return new Promise((resolve, reject) => {

        const redis = new Redis(config.redis.url)

        redis.on('error', error => {
            reject(error)
        })

        redis.on('ready', () => {
            log.info(`Connected to Redis at ${config.redis.url}`)
            resolve(redis)
        })
    })
}

export default connect()
