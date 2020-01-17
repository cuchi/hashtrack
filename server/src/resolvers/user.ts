import {
    Query,
    ObjectType,
    Field,
    ID,
    Authorized,
    Ctx,
    Mutation,
    ArgsType,
    Args
} from "type-graphql"
import UserService from "../services/user"
import { Inject } from "typedi"
import { AuthorizedContext } from "../graphql"

@ObjectType()
class User {
    @Field(_ => ID) id: string
    @Field() name: string
    @Field() email: string
}

@ArgsType()
export class UserCreation {
    @Field() name: string
    @Field() email: string
    @Field() password: string
}

export class UserResolver {

    @Inject()
    private readonly users: UserService

    @Query(_ => User)
    @Authorized()
    currentUser(@Ctx() context: AuthorizedContext): User {
        return this.users.get(context)
    }

    @Mutation(_ => User)
    createUser(@Args(_ => UserCreation) user: UserCreation): User {
        return this.users.create(user)
    }
}