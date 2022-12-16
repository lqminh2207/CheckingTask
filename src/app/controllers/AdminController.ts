import { validate } from 'class-validator';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Member } from './../models/Member';
import * as dotenv from 'dotenv'
dotenv.config()

class AdminController {
    async register(req: Request, res: Response) {
        let { username, password, email, dob, image } = req.body;
        // const hasedpassword = await bcrypt.hash(req.body.password, 10) 
        const user = new Member()
        user.username = username
        user.password = password
        user.email = email
        user.dob = dob
        user.image = image

        // Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        user.hashPassword() 
        
        const userRepo = AppDataSource.getRepository(Member)
        try {
            await userRepo.save(user)
            res.status(201).send("User created");
        } catch (error) {
            res.status(409).send("Username already in use");
            return;
        }
    }

    // [GET] /admin/listAll
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
        
        res.send(users)
    }

    // [PATCH] /admin/:id
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

    // [DELETE] /admin/listAll/:id
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

    // [GET] /listAll/:projectId/project
    async getProject(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(Member)

        try {
            const query = userRepo
                .createQueryBuilder('member')
                .innerJoin('project_members_member', 'pro_mem', 'pro_mem.memberId = member.id')
                .innerJoin('project', 'pro', 'pro.id = pro_mem.projectId')
                .where('member.id = :id', { id: id })
                .getMany()
    
            res.send(query)
        } catch (error) {
            res.status(404).send("User not found");
        }
    }

    // [GET] /listAll/:projectId/projects/:taskId/tasks
    async getTask(req: Request, res: Response) {
        const id: number = parseInt(req.params.id);
        const userRepo = AppDataSource.getRepository(Member)

        try {
            const query = userRepo
                .createQueryBuilder('member')
                .innerJoin('project_members_member', 'pro_mem', 'pro_mem.memberId = member.id')
                .innerJoin('project', 'pro', 'pro.id = pro_mem.projectId')
                .innerJoin('task', 'task', 'task.projectId = pro.id')
                .where('member.id = :id', { id: id })
                .getMany()
    
            res.send(query)
        } catch (error) {
            res.status(404).send("User not found");
        }
    }
}

export default new AdminController();