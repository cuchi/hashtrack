import { Injectable } from '@angular/core';
import { getTweets, listenTweets } from '../lib/tweet'

export type Tweet = {
  text: string
  id: string
  publishedAt: string
  authorName: string
}

@Injectable({ providedIn: 'root' })
export class TweetService {

  private currentSubscriber?: any

  async getLatest(search: string): Promise<Tweet[]> {
    return getTweets(search)
  }

  async listen(search: string, listener: (tweet: Tweet) => void) {
    this.currentSubscriber?.unsubscribe()
    this.currentSubscriber = await listenTweets(search, listener)
  }
}
