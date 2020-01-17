import { createTestClient, ApolloServerTestClient } from "apollo-server-testing"
import { ApolloServerBase, gql } from "apollo-server-core"
import { schema } from '../../src/graphql'

const api = gql`
    mutation createUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }

    mutation createSession($email: String!, $password: String!) {
        createSession(email: $email, password: $password) {
            token
            createdAt
        }
    }
`

export function createClient(authToken?: string) {
    const headers = {
        authorization: authToken
    }

    const client = createTestClient(
        new ApolloServerBase({
            schema,
            context: () => ({ ctx: { req: { headers } } })
        })
    )

    return { ...client, call: callApi.bind(client) }
}

async function callApi(
    this: ApolloServerTestClient,
    operationName: string,
    variables?: Record<string, any>
) {
    const result = await this.query({ query: api, operationName, variables })
    if (result.errors?.length) {
        throw result.errors[0]
    }
    return result.data?.[operationName]
}
