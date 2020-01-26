import {
    ObjectType,
    Field,
    ID,
    Ctx,
    Authorized,
    Query,
    Arg,
    ResolverFilterData,
    Root,
    Subscription
} from "type-graphql"
import Container, { Inject } from "typedi"
import { AuthorizedContext } from "../graphql"
import { Tweet as TweetModel } from '../models/tweet'
import TweetService from "../services/tweet-service"
import TrackService from "../services/track-service"
import log from "../logger"

type TweetSubscription = ResolverFilterData<
    TweetModel,
    { search?: string },
    AuthorizedContext
>

@ObjectType()
class Tweet {
    @Field(_ => ID) id: string
    @Field() authorName: string
    @Field() publishedAt: Date
    @Field() text: string
}

type UnserializedTweet = Tweet & { publishedAt: string }

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

    @Subscription(_ => Tweet, {
        topics: 'tweet',
        filter: async (data: TweetSubscription) => {
            const { context, payload, args: { search } } = data
            const tracks = Container.get(TrackService)
            const tweets = Container.get(TweetService)

            return (!search || tweets.matches(search, payload))
                && (await tracks.hasVisibility(context, payload.hashtags))
        }
    })
    @Authorized()
    newTweet(
        @Root() tweet: UnserializedTweet,
        @Arg('search', { nullable: true }) _?: string
    ) {
        log.info('Streaming tweet')
        return { ...tweet, publishedAt: new Date(tweet.publishedAt) }
    }
}
