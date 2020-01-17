import { buildSchemaSync, ResolverData } from "type-graphql"
import { UserResolver } from "./resolvers/user"
import { ApolloServer } from "apollo-server-koa"
import Koa, { Context } from 'koa'
import { Container } from 'typedi'

export type AuthorizedContext = Context & {
    session: { foo: string }
}

function contextHandler(fullContext: { ctx: Context }) {
    const { ctx } = fullContext
    if (ctx.headers.authorization) {
        // TODO: Load session from token.
        ctx.session = { foo: 'bar' }
    }

    return ctx
}

function authChecker(resolverData: ResolverData<Context>) {
    return resolverData.context.session !== undefined
}

const schema = buildSchemaSync({
    resolvers: [UserResolver],
    container: Container,
    authChecker
})

const server = new ApolloServer({ schema, context: contextHandler })

export function applyGraphql(app: Koa) {
    server.applyMiddleware({ app, path: '/graphql' })
}
