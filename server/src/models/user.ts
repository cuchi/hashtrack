import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
} from 'typeorm'
import { Session } from './session'

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
