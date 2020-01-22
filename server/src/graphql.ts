import { buildSchemaSync, ResolverData } from "type-graphql"
import { UserResolver } from "./resolvers/user-resolver"
import { SessionResolver } from "./resolvers/session-resolver"
import { TrackResolver } from "./resolvers/track-resolver"
import { ApolloServer } from "apollo-server-koa"
import Koa from 'koa'
import { Container } from 'typedi'
import SessionService from "./services/session-service"
import { Session } from "./models/session"
import { TweetResolver } from "./resolvers/tweet-resolver"
import pubSub from "./pub-sub"
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

export const schema = buildSchemaSync({
    resolvers: [SessionResolver, UserResolver, TrackResolver, TweetResolver],
    container: Container,
    authChecker,
    pubSub
})

export const server = new ApolloServer({ schema, context: contextHandler })

export function applyGraphql(app: Koa) {
    server.applyMiddleware({ app, path: '/graphql' })
}

export function applySubscriptions(httpServer: Server) {
    server.installSubscriptionHandlers(httpServer)
}

