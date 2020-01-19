import {
    ObjectType,
    Field,
    ID,
    Mutation,
    Arg,
    Ctx,
    Authorized,
    Query
} from "type-graphql"
import { Inject } from "typedi"
import TrackService from "../services/track-service"
import { AuthorizedContext } from "../graphql"

@ObjectType()
class Track {
    @Field(_ => ID) hashtagName: string
    @Field() prettyName: string
    @Field() createdAt: Date
}

export class TrackResolver {

    @Inject()
    private readonly service: TrackService

    @Mutation(_ => Track)
    @Authorized()
    createTrack(
        @Ctx() context: AuthorizedContext,
        @Arg('hashtag') hashtag: string
    ): Promise<Track> {
        return this.service.create(context, hashtag)
    }
    
    @Mutation(_ => Track)
    @Authorized()
    removeTrack(
        @Ctx() context: AuthorizedContext,
        @Arg('hashtag') hashtag: string
    ): Promise<Track> {
        return this.service.remove(context, hashtag)
    }

    @Query(_ => [Track])
    @Authorized()
    tracks(@Ctx() context: AuthorizedContext): Promise<Track[]> {
        return this.service.get(context)
    }
}
