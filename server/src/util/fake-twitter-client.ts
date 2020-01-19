import { TwitterClient, Options } from '../services/twitter-client-service'
import { format } from 'date-fns'
import { EventEmitter } from 'typeorm/platform/PlatformTools'

export class FakeTwitterClient implements TwitterClient {
    
    public currentRoute?: string
    public currentOptions?: Options
    private listener?: (...args: unknown[]) => void | Promise<void>

    stream(route: string, options: Options) {
        this.currentRoute = route
        this.currentOptions = options
        const fakeStream = Object.assign(new EventEmitter(), { stop() {} })

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
