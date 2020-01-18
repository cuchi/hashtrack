import {
    Entity,
    PrimaryColumn,
    CreateDateColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm'
import { User } from './user'

@Entity()
export class Session {
    @PrimaryColumn('text')
    token: string

    @Column('uuid')
    userId: string

    @CreateDateColumn()
    createdAt: Date

    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    @ManyToOne(_ => User, u => u.sessions)
    user: User
}
