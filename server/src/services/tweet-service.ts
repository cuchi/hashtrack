import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository, Brackets, DeepPartial } from 'typeorm'
import { Tweet } from "../models/tweet"
import HashtagService from './hashtag-service'
import { TwitterClient, Stream } from "./twitter-client-service"
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

    @Inject(_ => HashtagService)
    private readonly hashtags: HashtagService

    @Inject('TwitterClient')
    private readonly client: TwitterClient

    @InjectRepository(Tweet)
    private readonly repository: Repository<Tweet>

    async refreshStream() {
        this.activeStream?.stop()
        const hashtags = await this.hashtags.getAllActive()
        const names = hashtags.map(({ name }) => `#${name}`)

        if (names.length === 0) {
            log.info('No hashtags to track at the moment')
            return
        }

        log.info(`Tracking ${names.length} hashtags...`)
        this.activeStream = this.client.stream('statuses/filter', { track: names })
        
        this.activeStream.on('tweet', this.handleTweet.bind(this))
    }

    async handleTweet(tweet: ApiTweet) {
        log.info(`Got a tweet: ${tweet.id_str}`)
        const savedTweet = await this.persist({
            authorName: `@${tweet.user.screen_name}`,
            publishedAt: new Date(tweet.created_at),
            id: tweet.id_str,
            text: tweet.text,
            hashtags: tweet.entities.hashtags.map(({ text }) => ({
                name: this.hashtags.normalize(text)
            }))
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

    async deleteOldTweets() {
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
}
