import { ApolloClient } from "apollo-client"
import { InMemoryCache } from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"

const cache = new InMemoryCache()
const link = new HttpLink({
    uri: "http://localhost:8080/graphql"
});

export default new ApolloClient({ cache, link })

export function getErrorMessage(error) {
    return error.graphQLErrors[0].message
}
