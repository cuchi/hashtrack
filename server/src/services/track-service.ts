import { Service } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Track } from "../models/track"
import { AuthorizedContext } from "../graphql"

@Service()
export default class SessionService {

    @InjectRepository(Track)
    private readonly repository: Repository<Track>

    private normalize(prettyName: string) {
        return prettyName.trim().toLowerCase().replace('#', '')
    }

    async create(context: AuthorizedContext, name: string) {
        const { userId } = context.session
        const hashtagName = this.normalize(name)
        if (hashtagName.length === 0) {
            throw new Error(`"${name}" is not a valid hashtag`)
        }
        return this.repository.save({
            userId,
            prettyName: name,
            hashtag: { name: hashtagName }
        })
    }

    async remove(context: AuthorizedContext, name: string) {
        const { userId } = context.session
        const existingTrack = await this.repository
            .findOneOrFail({ userId, hashtagName: this.normalize(name) })
        
        await this.repository.remove({ ...existingTrack })

        return existingTrack
    }
}
