import { env } from 'process'

const isProd = env.NODE_ENV === 'production'

function isTrue(envVar: string) {
    return ['1', 'true', 't', 'yes', 'y'].includes(envVar.toLowerCase())
}

export default {
    port: Number(env.PORT) || 8080,
    db: {
        username: env.PGUSER || 'postgres',
        password: env.PGPASSWORD ?? '123456',
        database: env.PGDATABASE || 'postgres',
        host: env.PGHOST || 'localhost',
        port: Number(env.PGPORT) || 5432,
        synchronize: env.FORCE_SYNC === undefined
            ? !isProd
            : isTrue(env.FORCE_SYNC)
    }
}
