import { RedisPubSub } from "graphql-redis-subscriptions"
import redis from "./redis"

async function createPubSub() {
    return new RedisPubSub({
        publisher: await redis,
        subscriber: await redis
    })
}

export default createPubSub()