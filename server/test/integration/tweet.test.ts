import { describe, it, beforeEach } from "mocha"
import { expect } from 'chai'
import { createClient, Client } from "./helpers/graphql-helpers"
import { UserFactory } from "./factories/user-factory"
import { resetDatabase, count, getAll } from "./helpers/db-helpers"
import { TweetFactory } from "./factories/tweet-factory"
import TweetService from "../../src/services/tweet-service"
import Container from "typedi"

describe('Tweets', () => {
    let client: Client
    let userFactory: UserFactory
    let tweetFactory: TweetFactory

    before(async () => {
        client = await createClient()
        userFactory = new UserFactory(client)
        tweetFactory = new TweetFactory()
    })

    beforeEach(resetDatabase)

    it('Should consume a tracked tweet', async () => {
        const client = await userFactory.createWithClient()
        await client.call('createTrack', { name: '#foo' })
        await Container.get(TweetService).refreshStream()
        
        await tweetFactory.create(['#FOO'])

        expect(await count('tweet')).to.be.equal(1)
    })

    it('Should create new local hashtags automatically when consuming tweets', async () => {
        const client = await userFactory.createWithClient()
        await client.call('createTrack', { name: '#foo' })
        await Container.get(TweetService).refreshStream()
        
        await tweetFactory.create(['#FOO', '#bar'])

        const tweets = await getAll('hashtag')
        expect(tweets.find((hashtag: any) => hashtag.name === 'bar')).to.exist
    })
})
