import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Track } from "../models/track"
import { AuthorizedContext } from "../graphql"
import HashtagService from "./hashtag-service"
import { Hashtag } from "../models/hashtag"

@Service()
export default class TrackService {

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

        return this.repository.save({
            userId,
            prettyName: name.startsWith('#') ? name : `#${name}`,
            hashtag: { name: hashtagName }
        })
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

    async hasVisibility(context: AuthorizedContext, hashtags: Hashtag[]) {
        const names = new Set(hashtags.map(({ name }) => name))
        const userHashtags = await this.get(context)

        for (const { hashtagName } of userHashtags) {
            if (names.has(hashtagName)) {
                return true
            }
        }

        return false
    }
}
