import { Task } from './Task';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"

@Entity()
export class TaskStatus {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    statusName: string

    @Column({ unique: true })
    order: number

    @Column({ default: "ACTIVE" })
    status: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @OneToMany(() => Task, task => task.taskStatus)
    tasks: Task[]
}