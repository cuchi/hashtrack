import { env } from 'process'
import dotenv from 'dotenv'

const isProd = env.NODE_ENV === 'production'
const isTest = env.NODE_ENV === 'test'

dotenv.config()

function getExisting(varName: string) {
    const value = env[varName]
    if (value === undefined) {
        console.error(`Required env var ${varName} was not defined!`)
        process.exit(1)
    }
    return value
}

function getTwitterConfig() {
    if (env.TWITTER_CONSUMER_KEY && !isTest) {
        return {
            kind: 'enabled',
            consumerKey: getExisting('TWITTER_CONSUMER_KEY'),
            consumerSecret: getExisting('TWITTER_CONSUMER_SECRET'),
            accessToken: getExisting('TWITTER_ACCESS_TOKEN'),
            accessTokenSecret: getExisting('TWITTER_ACCESS_TOKEN_SECRET')
        } as const
    }

    return { kind: 'disabled' } as const
}

function getLogLevel() {
    if (isTest) {
        return 'error'
    }

    switch (env.LOG_LEVEL) {
        case 'info':
        case 'debug':
        case 'error':
            return env.LOG_LEVEL
        default:
            return 'info'
    }
}

export default {
    port: Number(env.PORT) || 8080,
    logLevel: getLogLevel(),
    db: {
        username: env.PGUSER || 'postgres',
        password: env.PGPASSWORD ?? '123456',
        database: env.PGDATABASE || 'postgres',
        host: env.PGHOST || 'localhost',
        port: Number(env.PGPORT) || 5432,
        synchronize: !isProd || Boolean(env.FORCE_SYNC)
    },
    twitter: { 
        ...getTwitterConfig(),
        refreshInterval: Number(env.TWITTER_STREAM_REFRESH_INTERVAL) || 20
    }
}
