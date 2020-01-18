import {
    ObjectType,
    Field,
    ID,
    Mutation,
    Arg,
    Ctx,
    Authorized
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
    private readonly tracks: TrackService

    @Mutation(_ => Track)
    @Authorized()
    createTrack(
        @Ctx() context: AuthorizedContext,
        @Arg('hashtag') hashtag: string
    ): Promise<Track> {
        return this.tracks.create(context, hashtag)
    }
    
    @Mutation(_ => Track)
    @Authorized()
    removeTrack(
        @Ctx() context: AuthorizedContext,
        @Arg('hashtag') hashtag: string
    ): Promise<Track> {
        return this.tracks.remove(context, hashtag)
    }
}
