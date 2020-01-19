import { describe, it, beforeEach } from "mocha"
import { createClient } from "./helpers/graphql-helpers"
import { expect } from 'chai'
import { resetDatabase } from "./helpers/db-helpers"

describe('Users', async () => {
    const client = createClient()

    beforeEach(resetDatabase)

    it('Should create a valid user successfully', async () => {
        const createdUser = await client.call('createUser', {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            password: 'secret123456'
        })
        
        expect(createdUser).to.have.property('name').equal('John Doe')
        expect(createdUser).to.have.property('email').equal('john.doe@gmail.com')
        expect(createdUser).to.not.have.property('password')
        expect(createdUser).to.have.property('id')
            .that.is.a('string')
            .with.length.greaterThan(0)
    })

    it('Should fail to create an user with the same email twice', async () => {
        const user = {
            name: 'John Doe',
            email: 'john.doe@gmail.com',
            password: 'secret123456'
        }

        await client.call('createUser', user)
        const secondCreation = client.call('createUser', user)
        
        await expect(secondCreation).to.be.rejectedWith(
            /duplicate key value violates unique constraint/
        )
    })

    it('Should fail to create an user with an invalid email', async () => {
        const user = {
            name: 'John Doe',
            email: 'john.doe',
            password: 'secret123456'
        }

        const creation = client.call('createUser', user)

        await expect(creation).to.be
            .rejectedWith('"john.doe" is not a valid enail')
    })

    it('Should fail to create an user with an empty name', async () => {
        const user = {
            name: '   ',
            email: 'john.doe@gmail.com',
            password: 'secret123456'
        }

        const creation = client.call('createUser', user)
        
        await expect(creation).to.be.rejectedWith('The user name is empty')
    })
})
