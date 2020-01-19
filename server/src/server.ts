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
    const tweetService = Container.get(TweetService)
    await tweetService.refreshStream()
    app.listen(config.port)
    console.log(`Listening on port ${config.port}`)

    setInterval(async () => {
        console.log('Refreshing the tweet stream...')
        await tweetService.refreshStream()
    }, config.twitter.refreshInterval * 1000)
}

run().catch(error => {
    console.error(error.stack ?? error.message)
    process.exit(1)
})
