import { buildSchemaSync, ResolverData } from "type-graphql"
import { UserResolver } from "./resolvers/user"
import { SessionResolver } from "./resolvers/session"
import { ApolloServer } from "apollo-server-koa"
import Koa, { Context } from 'koa'
import { Container } from 'typedi'
import SessionService from "./services/session"
import { Session } from "./models/session"

export type AuthorizedContext = Context & {
    session: Session
}

async function contextHandler(fullContext: { ctx: Context }) {
    const { ctx } = fullContext
    if (ctx.headers.authorization) {
        const sessions = Container.get(SessionService)
        ctx.session = await sessions.find(ctx.headers.authorization)
    }

    return ctx
}

function authChecker(resolverData: ResolverData<Context>) {
    return resolverData.context.session !== undefined
}

export const schema = buildSchemaSync({
    resolvers: [SessionResolver, UserResolver],
    container: Container,
    authChecker
})

export const server = new ApolloServer({ schema, context: contextHandler })

export function applyGraphql(app: Koa) {
    server.applyMiddleware({ app, path: '/graphql' })
}
