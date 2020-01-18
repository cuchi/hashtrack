import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { setContext } from 'apollo-link-context'
import { HttpLink } from "apollo-link-http"

const cache = new InMemoryCache()
const link = new HttpLink({
    uri: "http://localhost:8080/graphql"
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: localStorage.getItem('token')
        }
    }
})

const client = new ApolloClient({ cache, link: authLink.concat(link) })

async function call(graphql, variables = {}) {
    const operation = graphql.definitions[0].operation
    const action = operation === 'mutation' ? 'mutate' : 'query'
    try {
        const result = await this[action]({ [operation]: graphql, variables })
        return Object.values(result.data)[0]
    } catch (error) {
        console.dir(error)
        throw new Error(error.graphQLErrors[0].message)
    }
}

export default {
    ...client,
    call: call.bind(client)
}
