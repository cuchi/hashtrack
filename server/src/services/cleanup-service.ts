import { Service, Inject } from "typedi"
import TweetService from "./tweet-service"
import HashtagService from "./hashtag-service"
import log from "../logger"

@Service()
export default class CleanupService {

    @Inject(_ => TweetService)
    private readonly tweets: TweetService

    @Inject(_ => HashtagService)
    private readonly hashtags: HashtagService

    async cleanup() {
        const affectedTweets = await this.tweets.removeOldTweets()
        if (affectedTweets) {
            log.info(`Removed ${affectedTweets} old tweets...`)
        }
        
        const affectedHashtags = await this.hashtags.removeUnused()
        if (affectedHashtags) {
            log.info(`Removed ${affectedHashtags} unused hashtags...`)
        }
    }
}
