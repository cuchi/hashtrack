import { RedisPubSub } from "graphql-redis-subscriptions"

export default new RedisPubSub({
    connection: {
        host: 'localhost'
    }
})
