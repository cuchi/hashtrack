import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Tweet } from "../models/tweet"
import HashtagService from './hashtag-service'
import { TwitterClient } from "./twitter-client-service"

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


    @Inject(_ => HashtagService)
    private readonly hashtags: HashtagService

    @Inject('TwitterClient')
    private readonly client: TwitterClient

    @InjectRepository(Tweet)
    private readonly repository: Repository<Tweet>

    async refreshStream() {
        const hashtags = await this.hashtags.getAllActive()
        const names = hashtags.map(({ name }) => `#${name}`)

        if (names.length === 0) {
            console.log('No hashtags to track at the moment')
            return
        }

        console.log(`Tracking ${names.length} hashtags...`)
        const stream = this.client.stream('statuses/filter', { track: names })
        
        stream.on('tweet', async (tweet: ApiTweet) => {
            console.log(`Got a tweet: ${tweet.id_str}`)
            await this.repository.save({
                authorName: tweet.user.screen_name,
                publishedAt: tweet.created_at,
                id: tweet.id_str,
                text: tweet.text,
                hashtags: tweet.entities.hashtags.map(({ text }) => ({
                    name: this.hashtags.normalize(text)
                }))
            })
        })

        stream.on('error', (error: Error) => [
            console.dir(error)
        ])
    }

}
