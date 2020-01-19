import { Service } from "typedi"
import { AuthorizedContext } from "../graphql"
import { UserCreation } from "../resolvers/user-resolver"
import { InjectRepository } from "typeorm-typedi-extensions"
import { User } from "../models/user"
import { Repository } from 'typeorm'
import bcrypt from 'bcrypt'

@Service()
export default class UserService {

    private readonly saltRounds = 10

    // Naive approach, some very specific cases won't match.
    private readonly emailRegex = /\S+@\S+\.\S+/

    @InjectRepository(User)
    private readonly repository: Repository<User>
    
    get(context: AuthorizedContext) {
        return context.session.user
    }

    private validate(user: UserCreation) {
        if (!this.emailRegex.test(user.email)) {
            throw new Error(`"${user.email}" is not a valid enail`)
        }

        if (user.name === '') {
            throw new Error('The user name is empty')
        }
    }

    async create(user: UserCreation) {
        const userToCreate = {
            email: user.email.trim().toLowerCase(),
            name: user.name.trim(),
            password: await bcrypt.hash(user.password, this.saltRounds)
        }
        this.validate(userToCreate)

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
