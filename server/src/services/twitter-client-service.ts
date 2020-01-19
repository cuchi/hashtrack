import EventEmitter from 'events'
import config from '../config'
import Container from 'typedi'
import Twit from 'twit'
import { FakeTwitterClient } from '../util/fake-twitter-client'

export type Stream = EventEmitter & { stop(): void; }
export type Options = { track: string[] }

export interface TwitterClient {
    stream(route: string, options: Options): Stream
}

const { twitter } = config

if (twitter.kind === 'enabled') {
    console.log('Credentials present, using the real Twitter API')
    Container.set('TwitterClient', 
        new Twit({
            consumer_key: twitter.consumerKey,
            consumer_secret: twitter.consumerSecret,
            access_token: twitter.accessToken,
            access_token_secret: twitter.accessTokenSecret
        }))
} else {
    console.log('No credentials specified, using a mocked Twitter client')
    Container.set('TwitterClient', new FakeTwitterClient())
}