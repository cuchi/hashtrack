import { RedisPubSub } from "graphql-redis-subscriptions"
import { connect } from "./redis"

export const publisherConnection = connect()
export const subscriberConnection = connect()

async function createPubSub() {
    return new RedisPubSub({
        publisher: await publisherConnection,
        subscriber: await subscriberConnection
    })
}

export default createPubSub()