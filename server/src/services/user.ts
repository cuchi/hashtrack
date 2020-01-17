import { Service } from "typedi"
import { AuthorizedContext } from "../graphql"
import { UserCreation } from "../resolvers/user"

@Service()
export default class UserService {

    get(context: AuthorizedContext) {
        return {
            id: context.session.foo,
            name: 'John Doe',
            email: 'john.doe@gmail.com'
        }
    }

    create(user: UserCreation) {
        return { ...user, id: '1' }
    }
}
