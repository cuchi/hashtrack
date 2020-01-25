import { Service } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Repository } from 'typeorm'
import { Hashtag } from "../models/hashtag"
import { Tweet } from "../models/tweet"
import { Track } from "../models/track"

@Service()
export default class HashtagService {

    @InjectRepository(Hashtag)
    private readonly repository: Repository<Hashtag>

    normalize(prettyName: string) {
        return prettyName.toLowerCase().replace(/[#|@|\s]/g, '')
    }

    async getAllActive(): Promise<Array<{ name: string }>> {
        return this.repository.createQueryBuilder('hashtag')
            .select('distinct hashtag.name')
            .innerJoin('hashtag.tracks', 'track')
            .getRawMany()
    }

    async removeUnused() {
        const relatedTweets = this.repository
            .createQueryBuilder()
            .subQuery()
            .from(Tweet, 'tweet')
            .select('tweet')
            .innerJoin(
                'tweet.hashtags',
                'tweetHashtag',
                'tweetHashtag.name = hashtag.name')
            .getQuery()

        const relatedTracks = this.repository
            .createQueryBuilder()
            .subQuery()
            .from(Track, 'track')
            .where('track.hashtagName = hashtag.name')
            .getQuery()

        const result = await this.repository
            .createQueryBuilder('hashtag')
            .delete()
            .where(`NOT EXISTS ${relatedTweets}`)
            .andWhere(`NOT EXISTS ${relatedTracks}`)
            .printSql()
            .execute()

        return result.affected ?? 0
    }
}
