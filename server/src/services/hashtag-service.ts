import { Service } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Hashtag } from "../models/hashtag"

@Service()
export default class HashtagService {

    @InjectRepository(Hashtag)
    private readonly repository: Repository<Hashtag>

    normalize(prettyName: string) {
        return prettyName.toLowerCase().replace(/[#|\s]/g, '')
    }

    async getAllActive(): Promise<Array<{ name: string }>> {
        return this.repository.createQueryBuilder('hashtag')
            .select('distinct hashtag.name')
            .innerJoin('hashtag.tracks', 'track')
            .getRawMany()
    }
}
