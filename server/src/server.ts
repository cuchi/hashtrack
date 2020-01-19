import "reflect-metadata"
import Koa from 'koa'
import cors from '@koa/cors'
import config from './config'
import { applyGraphql } from './graphql'
import dbConnection from './database'
import Container from "typedi"
import TweetService from "./services/tweet-service"

const app = new Koa()

app.use(cors())

applyGraphql(app)

app.use(async ctx => {
    ctx.redirect('/graphql')
})

async function run() {
    await dbConnection
    await Container.get(TweetService).refreshStream()
    app.listen(config.port)
    console.log(`Listening on port ${config.port}`)
}

run().catch(error => {
    console.error(error.stack ?? error.message)
    process.exit(1)
})
