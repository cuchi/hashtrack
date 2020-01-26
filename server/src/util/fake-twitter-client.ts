/* eslint-disable @typescript-eslint/camelcase */
import { TwitterClient, Options } from '../services/twitter-client-service'
import { format } from 'date-fns'
import { EventEmitter } from 'typeorm/platform/PlatformTools'
import Container from 'typedi'
import faker from 'faker'
import HashtagService from '../services/hashtag-service'
import config from '../config'

export class FakeTwitterClient implements TwitterClient {

    public currentRoute?: string
    public currentOptions?: Options
    private listener?: (...args: unknown[]) => void | Promise<void>

    constructor() {
        if (!config.twitter.streamFakeTweets) {
            return
        }

        setInterval(async () => {
            const hashtags = await Container.get(HashtagService).getAllActive()
            if (!hashtags.length) {
                return
            }
            const hashtag = hashtags[
                Math.floor(Math.random() * hashtags.length)
            ]
            await this.sendFakeTweet(
                faker.lorem.sentence(20),
                faker.internet.userName(),
                [hashtag]
            )
        }, 5000)
    }

    stream(route: string, options: Options) {
        this.currentRoute = route
        this.currentOptions = options
        const fakeStream = Object.assign(new EventEmitter(), {
            stop() {/* ignore */}
        })

        fakeStream.on = (event: string, listener: (...args: unknown[]) => void) => {
            if (event === 'tweet') {
                this.listener = listener
            }
            return fakeStream
        }

        return fakeStream
    }

    async sendFakeTweet(text: string, author: string, hashtags: string[]) {
        await this.listener?.({
            text,
            id_str: Math.random().toString().slice(2),
            created_at: format(new Date(), 'E MMM dd HH:mm:ss XXXX y'),
            entities: {
                hashtags: hashtags.map(text => ({ text }))
            },
            user: {
                screen_name: author
            }
        })
    }
}
