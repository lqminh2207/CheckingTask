import { Task } from './Task';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from "typeorm"
import { IsEmail, Length } from "class-validator";
import * as bcrypt from 'bcrypt'
import { Project } from './Project';

@Entity()
export class Member {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true})
    inviteId: string

    @Column({ unique: true })
    @Length(6, 50)
    username: string

    @Column({ nullable: true})
    @Length(6, 100)
    password: string

    @Column({ nullable: true})
    dob: Date

    @Column()
    @IsEmail()
    email: string

    @Column({ nullable: true})
    image: string

    @Column({ default: "MEMBER" })
    role: string

    @Column({ default: "ACTIVE" })
    status: string

    @Column({ nullable: true})
    rememberToken: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @ManyToMany(() => Project, (project) => project.members)
    projects: Project[]

    @OneToMany(() => Task, task => task.member)
    tasks: Task[]

    hashPassword() {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    checkPassword(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
    }
}
