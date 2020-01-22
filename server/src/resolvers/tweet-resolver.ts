import {
    ObjectType,
    Field,
    ID,
    Ctx,
    Authorized,
    Query,
    Arg,
    Subscription,
    Root,
    ResolverFilterData
} from "type-graphql"
import Container, { Inject } from "typedi"
import { AuthorizedContext } from "../graphql"
import { Tweet as TweetModel } from '../models/tweet'
import TweetService from "../services/tweet-service"
import TrackService from "../services/track-service"

type TweetSubscription = ResolverFilterData<
    TweetModel, 
    string, 
    AuthorizedContext
>

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

    @Subscription(_ => Tweet, { topics: 
        'tweet', 
        filter: (data: TweetSubscription) => {
            return Container.get(TrackService)
                .hasVisibility(data.context, data.payload.hashtags)
        }
    })
    @Authorized()
    newTweet(@Root() tweet: Tweet) {
        return tweet
    }
}
