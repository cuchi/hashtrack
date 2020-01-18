import client from './graphql-client'
import gql from 'graphql-tag'

const createSession = gql`
    mutation createSession($email: String!, $password: String!) {
        createSession(email: $email, password: $password) {
            token
        }
    }
`

export function login(email, password) {
    return client.mutate({ 
        mutation: createSession, 
        variables: { email, password } 
    })
}
