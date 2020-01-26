import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository, Brackets, DeepPartial } from 'typeorm'
import { Tweet } from "../models/tweet"
import HashtagService from './hashtag-service'
import {
    TwitterClient,
    Stream,
    twitterClientService
} from "./twitter-client-service"
import { equals, intersection } from 'ramda'
import { AuthorizedContext } from "../graphql"
import log from "../logger"
import config from "../config"
import { publisherConnection } from '../pub-sub'


type ApiTweet = {
    id_str: string
    text: string
    created_at: string
    entities: {
        hashtags: Array<{
            text: string
        }>
    }
    user: {
        screen_name: string
    }
}

@Service()
export default class TweetService {

    private activeStream?: Stream
    private activeHashtags?: string[]

    @Inject(_ => HashtagService)
    private readonly hashtags: HashtagService

    @Inject(twitterClientService)
    private readonly client: TwitterClient

    @InjectRepository(Tweet)
    private readonly repository: Repository<Tweet>

    async refreshStream() {
        log.info('Refreshing the tweet stream...')
        const hashtags = await this.hashtags.getAllActive()

        if (hashtags.length === 0) {
            log.info('No hashtags to track at the moment')
            return
        }

        if (equals(hashtags, this.activeHashtags)) {
            log.info('No hashtags were updated since the last refresh')
            return
        }

        log.info(`Tracking ${hashtags.length} hashtags...`)
        this.activeHashtags = hashtags
        this.activeStream?.stop()
        this.activeStream = this.client
            .stream('statuses/filter', { track: hashtags.map(name => `#${name}`) })
            .on('tweet', this.handleTweet.bind(this))
    }

    private getValidHashtags(tweet: ApiTweet) {
        const tweetHashtags = tweet.entities.hashtags.map(({ text }) =>
            this.hashtags.normalize(text))
        return intersection(
            tweetHashtags,
            this.activeHashtags ?? [])
    }

    async handleTweet(tweet: ApiTweet) {
        const hashtags = this.getValidHashtags(tweet)
        if (!hashtags.length) {
            return
        }

        log.info(`Got a tweet with hashtags: ${hashtags}`)
        const savedTweet = await this.persist({
            authorName: `@${tweet.user.screen_name}`,
            publishedAt: new Date(tweet.created_at),
            id: tweet.id_str,
            text: tweet.text,
            hashtags: hashtags.map(name => ({ name }))
        })
        const publisher = await publisherConnection
        await publisher.publish('tweet', JSON.stringify(savedTweet))
    }

    private async persist(tweet: DeepPartial<Tweet>) {
        try {
            return await this.repository.save(tweet)
        } catch (error) {
            log.warn('Got a duplicate tweet, skipping...')
            return tweet
        }
    }

    async get(context: AuthorizedContext, search?: string) {
        const { userId } = context.session
        const query = this.repository
            .createQueryBuilder('tweet')
            .innerJoin('tweet.hashtags', 'hashtag')
            .innerJoin('hashtag.tracks', 'track')
            .where('track.userId = :userId', { userId })
            .orderBy('tweet.publishedAt', 'DESC')
            // TODO: Pagination
            .take(50)

        if (search) {
            query
                .andWhere(new Brackets(qb => qb
                    .where('tweet.text ILIKE :search')
                    .orWhere('tweet.authorName ILIKE :search')
                ))
                .setParameter('search', `%${search}%`)
        }

        return query.getMany()
    }

    async removeOldTweets() {
        const tweet = await this.repository
            .createQueryBuilder('tweet')
            .orderBy('tweet.publishedAt', 'DESC')
            .offset(config.twitter.keepTweetAmount)
            .limit(1)
            .getOne()

        if (!tweet) {
            return 0
        }

        const deletion = await this.repository
            .createQueryBuilder('tweet')
            .delete()
            .where('publishedAt < :pivotDate')
            .setParameter('pivotDate', tweet.publishedAt)
            .execute()

        return deletion.affected ?? 0
    }

    matches(search: string, tweet: Tweet) {
        const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const searchRegex = new RegExp(escapedSearch, 'i')

        return searchRegex.test(tweet.text)
            || searchRegex.test(tweet.authorName)
    }
}
