import { ResolverData, buildSchema } from "type-graphql"
import { UserResolver } from "./resolvers/user-resolver"
import { SessionResolver } from "./resolvers/session-resolver"
import { TrackResolver } from "./resolvers/track-resolver"
import { ApolloServer } from "apollo-server-koa"
import Koa from 'koa'
import { Container } from 'typedi'
import SessionService from "./services/session-service"
import { Session } from "./models/session"
import { TweetResolver } from "./resolvers/tweet-resolver"
import redisPubSub from "./pub-sub"
import { Server } from 'http'

type RequestContext = {
    ctx: Context
}

type SubscriptionContext = {
    connection: {
        context: Record<string, string | undefined>
    }
}

type IncomingContext = RequestContext | SubscriptionContext

type Context = {
    headers: Record<string, string | undefined>
    session?: Session
}

export type AuthorizedContext = Context & {
    session: Session
}

export async function contextHandler(fullContext: IncomingContext) {
    const sessions = Container.get(SessionService)
    if ('connection' in fullContext) {
        return {
            session: await sessions
                .find(fullContext.connection.context.Authorization ?? ''),
            headers: fullContext.connection.context
        }
    }

    const { ctx } = fullContext
    if (ctx.headers.authorization) {
        ctx.session = await sessions.find(ctx.headers.authorization)
    }

    return ctx
}

function authChecker(resolverData: ResolverData<Context>) {
    return resolverData.context.session !== undefined
}

export async function createSchema() {
    const pubSub = await redisPubSub
    
    return buildSchema({
        resolvers: [SessionResolver, UserResolver, TrackResolver, TweetResolver],
        container: Container,
        authChecker,
        pubSub
    })
}

export async function initGraphqlServer(app: Koa, http: Server) {
    const server = new ApolloServer({ 
        schema: await createSchema(), 
        context: contextHandler,
        subscriptions: {
            onConnect(params) {
                return params
            }
        }
    })
    server.applyMiddleware({ app, path: '/graphql' })
    server.installSubscriptionHandlers(http)

    return server
}

