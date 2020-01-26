import client from './graphql-client'
import gql from 'graphql-tag'

const graphql = {
    tweets: gql`
        query tweets($search: String!) {
            tweets(search: $search) {
                id
                authorName
                text
                publishedAt
            }
        }
    `,

    newTweets: gql`
        subscription newTweet($search: String!) {
            newTweet(search: $search) {
                id
                authorName
                text
                publishedAt
            }
        }
    `
}

export async function getTweets(search) {
    return client.call(graphql.tweets, { search })
}

export async function listenTweets(search, listener) {
    return client.subscribe(graphql.newTweets, { search }, data =>
        listener(data.newTweet))
}
