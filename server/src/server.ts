import "reflect-metadata"
import Koa from 'koa'
import config from './config'
import { applyGraphql } from './graphql'

const app = new Koa()

applyGraphql(app)

app.use(async ctx => {
    ctx.redirect('/graphql')
})

app.listen(config.port)
console.log(`Listening on port ${config.port}`)
