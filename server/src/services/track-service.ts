import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Track } from "../models/track"
import { AuthorizedContext } from "../graphql"
import TweetService from "./tweet-service"
import HashtagService from "./hashtag-service"

@Service()
export default class TrackService {

    @Inject(_ => TweetService)
    private readonly tweets: TweetService

    @Inject(_ => HashtagService)
    private readonly hashtags: HashtagService

    @InjectRepository(Track)
    private readonly repository: Repository<Track>

    async create(context: AuthorizedContext, name: string) {
        const { userId } = context.session
        const hashtagName = this.hashtags.normalize(name)
        if (hashtagName.length === 0) {
            throw new Error(`"${name}" is not a valid hashtag`)
        }
        const track = await this.repository.save({
            userId,
            prettyName: name,
            hashtag: { name: hashtagName }
        })
        await this.tweets.refreshStream()

        return track
    }

    async remove(context: AuthorizedContext, name: string) {
        const { userId } = context.session
        const existingTrack = await this.repository.findOneOrFail({ 
            userId, 
            hashtagName: this.hashtags.normalize(name)
        })
        
        await this.repository.remove({ ...existingTrack })

        return existingTrack
    }

    async get(context: AuthorizedContext) {
        const { userId } = context.session
        return this.repository.find({ userId })
    }
}
