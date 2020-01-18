import {
    ObjectType,
    Field,
    ID,
    Mutation,
    ArgsType,
    Args
} from "type-graphql"
import { Inject } from "typedi"
import SessionService from "../services/session-service"

@ObjectType()
class Session {
    @Field(_ => ID) token: string
    @Field() createdAt: Date
}

@ArgsType()
export class SessionCreation {
    @Field() email: string
    @Field() password: string
}

export class SessionResolver {

    @Inject()
    private readonly sessions: SessionService

    @Mutation(_ => Session)
    createSession(@Args(_ => SessionCreation) session: SessionCreation): Promise<Session> {
        return this.sessions.create(session.email, session.password)
    }
}