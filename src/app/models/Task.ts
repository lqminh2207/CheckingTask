import { Type } from './Type';
import { TaskPriority } from './TaskPriority';
import { TaskStatus } from './TaskStatus';
import { Project } from './Project';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    assignee: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @ManyToOne(() => Project, project => project.tasks)
    project: Project

    @ManyToOne(() => TaskPriority, taskPriority => taskPriority.tasks)
    taskPriority: TaskPriority

    @ManyToOne(() => TaskStatus, taskStatus => taskStatus.tasks)
    taskStatus: TaskStatus

    @ManyToOne(() => Type, type => type.tasks)
    type: Type
}