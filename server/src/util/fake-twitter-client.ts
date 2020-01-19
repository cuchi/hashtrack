import EventEmitter from 'events'

type Options = { track: string[] }

export class FakeTwitterClient {
    
    public currentRoute?: string
    public currentOptions?: Options
    public currentStream?: EventEmitter

    stream(route: string, options: Options) {
        this.currentRoute = route
        this.currentOptions = options
        this.currentStream = new EventEmitter()
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
