import {
    ObjectType,
    Field,
    ID,
    Ctx,
    Authorized,
    Query,
    Arg,
    Subscription,
    Root
} from "type-graphql"
import { Inject } from "typedi"
import { AuthorizedContext } from "../graphql"
import TweetService from "../services/tweet-service"

@ObjectType()
class Tweet {
    @Field(_ => ID) id: string
    @Field() authorName: string
    @Field() publishedAt: Date
    @Field() text: string
}

export class TweetResolver {

    @Inject()
    private readonly service: TweetService

    @Query(_ => [Tweet])
    @Authorized()
    tweets(
        @Ctx() context: AuthorizedContext,
        @Arg('search', { nullable: true }) search?: string
    ): Promise<Tweet[]> {
        return this.service.get(context, search)
    }

    @Subscription(_ => Tweet, { topics: 'tweet' })
    @Authorized()
    newTweet(@Root() tweet: Tweet) {
        return tweet
    }
}
