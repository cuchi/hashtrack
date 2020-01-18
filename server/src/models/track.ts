import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { User } from './user'
import { Hashtag } from './hashtag'

@Entity()
export class Track {
    @PrimaryColumn('text')
    hashtagName: string

    @PrimaryColumn('uuid')
    userId: string

    @Column('text')
    prettyName: string

    @CreateDateColumn()
    createdAt: Date

    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    @ManyToOne(_ => User, u => u.tracks)
    user: User

    @JoinColumn({ name: 'hashtagName', referencedColumnName: 'name' })
    @ManyToOne(_ => Hashtag, h => h.tracks, { cascade: true, onDelete: 'RESTRICT' })
    hashtag: Hashtag
}
