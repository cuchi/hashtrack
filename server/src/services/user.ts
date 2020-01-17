import { Service } from "typedi"
import { AuthorizedContext } from "../graphql"
import { UserCreation } from "../resolvers/user"
import { InjectRepository } from "typeorm-typedi-extensions"
import { User } from "../models/user"
import { Repository } from 'typeorm'
import bcrypt from 'bcrypt'

@Service()
export default class UserService {

    private readonly saltRounds = 10

    @InjectRepository(User)
    private readonly repository: Repository<User>
    
    get(context: AuthorizedContext) {
        return context.session.user
    }

    async create(user: UserCreation) {
        const userToCreate = {
            ...user,
            password: await bcrypt.hash(user.password, this.saltRounds)
        }
        return this.repository.save(userToCreate)
    }

    async authenticate(email: string, plainPassword: string) {
        const user = await this.repository.findOne({ where: { email } })

        if (!user || !await bcrypt.compare(plainPassword, user.password)) {
            throw new Error('Wrong email or password!')
        }

        return user
    }
}
