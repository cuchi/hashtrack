import { createConnection, useContainer } from 'typeorm'
import { Container } from 'typedi'
import config from './config'
import log from './logger'
import { Hashtag } from './models/hashtag'
import { Tweet } from './models/tweet'
import { User } from './models/user'
import { Session } from './models/session'
import { Track } from './models/track'

useContainer(Container)

async function connect() {
    const connection = await createConnection({
        type: 'postgres',
        ...config.db,
        logger: 'debug',
        logging: ['error'],
        entities: [
            Hashtag,
            Tweet,
            User,
            Session,
            Track
        ]
    })
    log.info(`Connected to Postgres at ${config.db.url}`)

    return connection
}

export default connect()
