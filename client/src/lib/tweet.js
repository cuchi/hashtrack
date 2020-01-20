import client from './graphql-client'
import gql from 'graphql-tag'

const graphql = {
    tweets: gql`
        query tweets {
            tweets {
                id
                authorName
                text
                publishedAt
            }
        }
    `
}

export async function getTweets() {
    return client.call(graphql.tweets)
}
