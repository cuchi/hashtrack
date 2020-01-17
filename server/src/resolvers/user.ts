import { Query, ObjectType, Field, ID, Authorized } from "type-graphql";

@ObjectType()
class User {
    @Field(_ => ID) id: string
    @Field() name: string
    @Field() email: string
}

export class UserResolver {

    @Query(_ => User)
    @Authorized()
    me(): User {
        return {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@gmail.com'
        }
    }
}