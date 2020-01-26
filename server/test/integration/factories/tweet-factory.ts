import faker from 'faker'
import Container from 'typedi'
import { FakeTwitterClient } from '../../../src/util/fake-twitter-client'

export class TweetFactory {

    private readonly client: FakeTwitterClient

    constructor() {
        this.client = Container.get('TwitterClient')
        if (!this.client.sendFakeTweet) {
            console.error(
                'This is not the fake client, the environment is messed up!'
            )
        }
    }

    async create(hashtags = ['#foo']) {
        await this.client.sendFakeTweet(
            faker.lorem.sentence(20),
            faker.internet.userName(),
            hashtags
        )
    }
}
