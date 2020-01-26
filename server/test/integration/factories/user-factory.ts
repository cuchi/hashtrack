import { createClient, Client } from '../helpers/graphql-helpers'
import faker from 'faker'

export class UserFactory {

    private readonly client: Client

    constructor(client: Client) {
        this.client = client
    }

    private getFakeUser() {
        return {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }
    }

    async create() {
        const user = this.getFakeUser()
        const result = await this.client.call('createUser', user)

        return { ...user, ...result }
    }

    async createWithClient() {
        const user = this.getFakeUser()
        await this.client.call('createUser', user)
        const { token } = await this.client.call('createSession', user)

        return createClient(token)
    }
}
