import client from './graphql-client'
import gql from 'graphql-tag'

const graphql = {
    createSession: gql`
        mutation createSession($email: String!, $password: String!) {
            createSession(email: $email, password: $password) {
                token
            }
        }
    `
}

export async function createSession(email, password) {
    return client.call(graphql.createSession, { email, password })
}
