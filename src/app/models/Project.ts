import { Task } from './Task';
import slugify from "slugify"
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { Member } from "./Member"
import { IsDateString, MinDate } from 'class-validator';

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true })
    slug: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @OneToMany(() => Task, task => task.project)
    tasks: Task[]

    @ManyToMany(() => Member)
    @JoinTable()
    members: Member[]

    createSlug() {
        if (this.name) {
            this.slug = slugify(this.name, { lower: true, strict: true })
        }
    }
}

// Project.pre('validate', function(next) { 
//     if (this.title) {
//         this.slug = slugify(this.title, { lower: true, strict: true })
//     }

//     if (this.markdown) {
//         this.sanitizedHTML = dompurify.sanitize(marked(this.markdown))
//     }

//     next()
// })
