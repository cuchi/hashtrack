import { describe, it, beforeEach } from "mocha"
import { createClient } from "./graphql-helpers"
import dbConnection from '../../src/database'
import { expect } from 'chai'

describe('Sessions', async () => {
    const client = createClient()

    beforeEach(async () => {
        await (await dbConnection).synchronize(true)
    })

    it('Should create a new session for an existing user', async () => {
        const createdSession = await client.call('createSession', {
            email: 'john.doe@gmail.com',
            password: 'secret123456'
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
})
