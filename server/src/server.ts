import "reflect-metadata"
import Koa from 'koa'
import config from './config'
import { applyGraphql } from './graphql'
import dbConnection from './database'

const app = new Koa()

applyGraphql(app)

app.use(async ctx => {
    ctx.redirect('/graphql')
})

async function run() {
    await dbConnection
    app.listen(config.port)
    console.log(`Listening on port ${config.port}`)
}

run().catch(error => {
    console.error(error.stack ?? error.message)
    process.exit(1)
})
