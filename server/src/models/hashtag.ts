import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    OneToMany
} from 'typeorm'
import { Track } from './track'

@Entity()
export class Hashtag {
    @PrimaryColumn('text')
    name: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(_ => Track, t => t.hashtag)
    tracks: Track[]
}
