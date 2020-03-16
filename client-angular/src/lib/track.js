import client from './graphql-client'
import gql from 'graphql-tag'

const graphql = {
    tracks: gql`
        query tracks {
            tracks {
                hashtagName
                prettyName
                createdAt
            }
        }
    `,

    createTrack: gql`
        mutation createTrack($name: String!) {
            createTrack(hashtag: $name) {
                hashtagName,
                prettyName,
                createdAt
            }
        }
    `,

    removeTrack: gql`
        mutation removeTrack($name: String!) {
            removeTrack(hashtag: $name) {
                hashtagName,
                prettyName,
                createdAt
            }
        }
    `
}

export async function getTracks() {
    return client.call(graphql.tracks)
}

export async function createTrack(name) {
    return client.call(graphql.createTrack, { name })
}

export async function removeTrack(name) {
    return client.call(graphql.removeTrack, { name })
}
