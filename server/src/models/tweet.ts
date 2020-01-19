import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    Column,
    ManyToMany,
    JoinTable
} from 'typeorm'
import { Hashtag } from './hashtag'

@Entity()
export class Tweet {
    @PrimaryColumn('text')
    id: string

    @Column('text')
    authorName: string

    @Column('text')
    text: string

    @Column('timestamptz')
    publishedAt: Date

    @CreateDateColumn()
    createdAt: Date

    @ManyToMany(_ => Hashtag, { cascade: true })
    @JoinTable({ name: 'tweet_hashtag' })
    hashtags: Hashtag[]
}
