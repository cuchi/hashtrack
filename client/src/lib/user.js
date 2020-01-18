import client from './graphql-client'
import gql from 'graphql-tag'

const currentUser = gql`
    query currentUser {
        currentUser {
            id
            name
            email
        }
    }
`

export function getCurrentUser() {
    return client.query({ query: currentUser })
}
