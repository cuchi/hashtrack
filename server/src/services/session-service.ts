import { Service, Inject } from "typedi"
import { InjectRepository } from 'typeorm-typedi-extensions'
import { Session } from "../models/session"
import { Repository } from 'typeorm'
import UserService from "./user-service"
import { randomBytes } from 'crypto'

@Service()
export default class SessionService {

    private readonly tokenSize = 48

    @InjectRepository(Session)
    private readonly repository: Repository<Session>

    @Inject(_ => UserService)
    private readonly users: UserService

    async find(token: string) {
        return this.repository
            .findOne({ where: { token }, relations: ['user'] })
    }

    generateToken() {
        return randomBytes(this.tokenSize).toString('base64')
    }

    async create(email: string, password: string) {
        const user = await this.users
            .authenticate(email.trim().toLowerCase(), password)

        return this.repository.save({
            token: this.generateToken(),
            userId: user.id
        })
    }
}
