import EventEmitter from 'events'
import config from '../config'
import Container from 'typedi'
import Twit from 'twit'
import { FakeTwitterClient } from '../util/fake-twitter-client'
import log from '../logger'

export type Stream = EventEmitter & { stop(): void; }
export type Options = { track: string[] }

export const twitterClientService = 'TwitterClient'

export interface TwitterClient {
    stream(route: string, options: Options): Stream
}

const { twitter } = config

if (twitter.kind === 'enabled') {
    log.info('Credentials present, using the real Twitter API')
    Container.set(twitterClientService, 
        new Twit({
            consumer_key: twitter.consumerKey,
            consumer_secret: twitter.consumerSecret,
            access_token: twitter.accessToken,
            access_token_secret: twitter.accessTokenSecret
        }))
} else {
    log.info('No credentials specified, using a mocked Twitter client')
    Container.set(twitterClientService, new FakeTwitterClient())
}