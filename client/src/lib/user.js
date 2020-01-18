import client from './graphql-client'
import gql from 'graphql-tag'

const graphql = {
    currentUser: gql`
        query currentUser {
            currentUser {
                id
                name
                email
            }
        }
    `,

    createUser: gql`
        mutation createUser(
            $name: String!, 
            $email: String!, 
            $password: String!
        ) {
            createUser(name: $name, email: $email, password: $password) {
                id
                name
                email
            }
        }
    `
}

export function getCurrentUser() {
    return client.call(graphql.currentUser)
}

export function createUser(name, email, password) {
    const variables = { name, email, password }
    return client.call(graphql.createUser, variables)
}
