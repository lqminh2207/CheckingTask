import { Task } from './../models/Task';
import { Project } from './../models/Project';
import { validate } from 'class-validator';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Member } from './../models/Member';
import * as dotenv from 'dotenv'
dotenv.config()

class AdminController {
    // [GET] /listAll
    async listAll(req: Request, res: Response) {
        // const userRepo = AppDataSource.getRepository(Member)
        // const users = await userRepo.find({
        //     select: ["id", 'username', "email", "dob", "role", "status"]
        // })

        // const users = await userRepo.createQueryBuilder('user').getMany()

        // const users = await userRepo.createQueryBuilder('m').select(['m.id', 'm.username', 'm.email', 'm.dob', 'm.role', 'm.status'])
        // .orderBy('id').getMany()
        const users = await AppDataSource.createQueryBuilder().select(['m.id', 'm.username', 'm.email', 'm.dob', 'm.role', 'm.status'])
        .from('member', 'm').orderBy('id').getMany()
        
        res.send({ message: "Succesfully", data: users})
    }

    // [PATCH] /:id
    async updateUser(req: Request, res: Response) {
        let { username, dob, email, status } = req.body;
        const id: number = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(Member)
        let user: Member

        try {
            user = await userRepo.findOneByOrFail({ id: id });
        } catch (error) {
            res.status(404).send("User not found");
            return; 
        }

        user.username = username
        user.dob = dob
        user.email = email
        user.status = status
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await userRepo.save(user);
        } catch (e) {
            res.status(409).send("Username already in use");
            return;
        }

        res.status(204).send('Updated successfully!');
    }

    // [DELETE] /listAll/:id
    async deleteUser(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(Member)
        let user: Member

        try {
            user = await userRepo.findOneByOrFail({ id: id });
        } catch (error) {
            res.status(404).send("User not found");
            return; 
        }

        userRepo.delete(id)
        res.status(204).send('Delete successfully!');
    }

    // [GET] /listAll/:memberId/project
    async getProject(req: Request, res: Response) {
        const id: number = parseInt(req.params.memberId);
        const userRepo = AppDataSource.getRepository(Member)

        try {
            const projects = await userRepo.findOneOrFail({
                select: ['id', 'projects'],
                relations: {
                    projects: true
                },
                where: { id: id }
            })
    
            res.send(projects)
        } catch (error) {
            res.status(404).send("User not found");
        }
    }

    // [GET] /listAll/:memberId/projects/:projectId/
    async getTask(req: Request, res: Response) {
        const memberId: number = parseInt(req.params.memberId);
        const projectId: number = parseInt(req.params.projectId);
        const taskRepo = AppDataSource.getRepository(Task)

        try {
            const query = await taskRepo.createQueryBuilder()
            .loadAllRelationIds().where({ member: memberId, project: projectId })
            .getMany()
    
            res.send(query)
        } catch (error) {
            res.status(404).send("Something went wrong");
        }
    }
}

export default new AdminController();