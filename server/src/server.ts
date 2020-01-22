import "reflect-metadata"
import Koa from 'koa'
import cors from '@koa/cors'
import config from './config'
import { applyGraphql } from './graphql'
import dbConnection from './database'
import Container from "typedi"
import TweetService from "./services/tweet-service"
import log from "./logger"

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
    log.info(`Listening on port ${config.port}`)

    setInterval(async () => {
        log.info('Refreshing the tweet stream...')
        await tweetService.refreshStream()
    }, config.twitter.refreshInterval * 1000)

    setInterval(async () => {
        const deletedCount = await tweetService.deleteOldTweets()
        if (deletedCount) {
            log.info(`${deletedCount} old tweets deleted!`)
        }
    }, 30000)
}

run().catch(error => {
    log.error(error.stack ?? error.message)
    process.exit(1)
})
