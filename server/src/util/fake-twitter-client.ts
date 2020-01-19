import EventEmitter from 'events'
import {
    TwitterClient,
    Options,
    Stream
} from '../services/twitter-client-service'

export class FakeTwitterClient implements TwitterClient {
    
    public currentRoute?: string
    public currentOptions?: Options
    public currentStream?: Stream

    stream(route: string, options: Options) {
        this.currentRoute = route
        this.currentOptions = options
        this.currentStream = Object.assign(new EventEmitter(), { stop() {} })
        return this.currentStream
    }

    sendFakeTweet(text: string, author: string, hashtags: string[]) {
        this.currentStream?.emit('tweet', {
            text,
            id_str: Math.random().toString().slice(2),
            created_at: new Date().toString(),
            entities: {
                hashtags: hashtags.map(text => ({ text }))
            },
            user: {
                screen_name: author
            }
        })
    }
}
