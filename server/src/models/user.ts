import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Index
} from 'typeorm'
import { Session } from './session'

@Index(['email'], { unique: true })
@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text')
    email: string

    @Column('text')
    name: string

    @Column('text')
    password: string

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(_ => Session, s => s.user)
    sessions?: Session[]
}
