import { describe, it, beforeEach } from "mocha"
import { expect } from 'chai'
import { createClient } from "./helpers/graphql-helpers"
import { UserFactory } from "./factories/user-factory"
import { getDatabaseDate, resetDatabase } from "./helpers/db-helpers"

describe('Hashtag tracks', () => {
    const client = createClient()
    const userFactory = new UserFactory(client)

    beforeEach(resetDatabase)

    it('Should create a hashtag track', async () => {
        const before = await getDatabaseDate()
        const client = await userFactory.createWithClient()

        const track = await client.call('createTrack', { name: '#foo' })
        
        expect(track).to.have.property('prettyName').equal('#foo')
        const createdAt = new Date(track.createdAt)
        expect(createdAt).to.be.greaterThan(before)
    })

    it('Should normalize the hashtag name', async () => {
        const client = await userFactory.createWithClient()

        const track = await client.call('createTrack', { 
            name: '#ThisIsAPrettyHashtag'
        })

        expect(track).to.have.property('hashtagName')
            .equal('thisisaprettyhashtag')
    })

    it('Should remove invalid characters from a hashtag name', async () => {
        const client = await userFactory.createWithClient()

        const track = await client.call('createTrack', { 
            name: '  # foo #bar \nbaz '
        })

        expect(track).to.have.property('hashtagName')
            .equal('foobarbaz')
    })

    it('Should fail to track the same hashtag twice', async () => {
        const client = await userFactory.createWithClient()
        await client.call('createTrack', { name: '#foo' })
        
        const secondTrack =  client.call('createTrack', { name: '#FOO' })

        await expect(secondTrack).to.be.rejectedWith(/duplicate key value/)
    })
})
