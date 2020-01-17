import { createConnection, useContainer } from 'typeorm'
import { Container } from 'typedi'
import config from './config'

useContainer(Container)

export default createConnection({
    type: 'postgres', 
    ...config.db,
    entities: [`${__dirname}/models/*`]
})
