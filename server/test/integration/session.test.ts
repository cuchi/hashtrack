import { describe, it, beforeEach } from "mocha"
import { createClient } from "./helpers/graphql-helpers"
import { expect } from 'chai'
import { UserFactory } from "./factories/user-factory"
import { resetDatabase } from "./helpers/db-helpers"

describe('Sessions', async () => {
    const client = createClient()
    const userFactory = new UserFactory(client)

    beforeEach(resetDatabase)

    it('Should create a new session for an existing user', async () => {
        const user = await userFactory.create()
        const createdSession = await client.call('createSession', {
            email: user.email,
            password: user.password
        })
        
        expect(createdSession).to.have.property('token')
            .that.is.a('string')
            .with.length.greaterThan(0)
    })

    it('Should fail to create a new session for an non-existing user', async () => {
        const sessionCreation = client.call('createSession', {
            email: 'john.doe@gmail.com',
            password: 'secret123456'
        })
        
        await expect(sessionCreation).to.be.rejectedWith(
            'Wrong email or password!'
        )
    })

    it('Should use the generated token to create an authenticated context', async () => {
        const user = await userFactory.create()
        const { token } = await client.call('createSession', user)
        const authenticatedClient = createClient(token)
        
        const sessionUser = await authenticatedClient.call('currentUser')

        expect(sessionUser).to.have.property('id').equal(user.id)
        expect(sessionUser).to.have.property('name').equal(user.name)
        expect(sessionUser).to.have.property('email').equal(user.email)
    })

    it('Should fail to create an authenticated context from an invalid token', async () => {
        const authenticatedClient = createClient('foo')
        
        const retrieval = authenticatedClient.call('currentUser')

        await expect(retrieval).to.be.rejectedWith(/Access denied/)
    })
})
