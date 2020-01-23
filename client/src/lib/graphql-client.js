import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { setContext } from 'apollo-link-context'
import { split } from 'apollo-link'
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const cache = new InMemoryCache()
const httpLink = new HttpLink({
    uri: "http://localhost:8080/graphql"
})
const wsLink = new WebSocketLink({
    uri: `ws://localhost:8080/graphql`,
    options: {
        reconnect: true,
        lazy: true,
        connectionParams: () => ({
            Authorization: localStorage.getItem('token')
        })
    }
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            Authorization: localStorage.getItem('token')
        }
    }
})

const link = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink,
)

function handleErrorMessage(error) {
    const { graphQLErrors, networkError } = error

    if (graphQLErrors.length > 0) {
        return graphQLErrors[0].message
    }
    if (networkError && networkError.message.includes('Failed to fetch')) {
        return 'Could not connect to the server'
    }

    return 'Ooops, something went wrong!'
}

const client = new ApolloClient({ cache, link: authLink.concat(link) })

async function call(graphql, variables = {}) {
    const operation = graphql.definitions[0].operation
    const action = operation === 'mutation' ? 'mutate' : 'query'
    await this.clearStore()
    try {
        const result = await this[action]({ [operation]: graphql, variables })
        return Object.values(result.data)[0]
    } catch (error) {
        throw new Error(handleErrorMessage(error))
    }
}

async function subscribe(graphql, variables, listener) {
    await this.stop()
    return this.subscribe({ query: graphql, variables })
        .subscribe(result => listener(result.data))
}

export default {
    ...client,
    call: call.bind(client),
    subscribe: subscribe.bind(client)
}
