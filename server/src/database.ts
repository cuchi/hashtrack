import { createConnection, useContainer } from 'typeorm'
import { Container } from 'typedi'
import config from './config'
import log from './logger'

useContainer(Container)

async function connect() {
    const connection = await createConnection({
        type: 'postgres', 
        ...config.db,
        entities: [`${__dirname}/models/*`]
    })
    log.info(`Connected to Postgres at ${config.db.url}`)

    return connection
}

export default connect()
