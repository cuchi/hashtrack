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
    `
}

export async function getTracks() {
    return client.call(graphql.tracks)
}

export async function createTrack(name) {
    
}
