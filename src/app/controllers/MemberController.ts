import { Task } from './../models/Task';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Member } from './../models/Member';
import * as jwt  from "jsonwebtoken" 
import { validate } from 'class-validator';


class MemberController {
    // [POST] /register
    async register(req: Request, res: Response) {
        let { username, password, email, dob, image } = req.body;
        // const hasedpassword = await bcrypt.hash(req.body.password, 10) 
        const user = new Member()
        user.username = username
        user.password = password
        user.email = email
        user.dob = dob
        user.image = image

        //Validade if the parameters are ok
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

    // [POST] /login
    async login (req: Request, res: Response) {
        let { username, password } = req.body;
        if (!(username && password)) {
            res.status(400).send("Please enter a username and password");
            return
        }

        const userRepo = AppDataSource.getRepository(Member)
        let user: Member

        try {
            user = await userRepo.findOneOrFail({ where: { username }})
        } catch (error) {
            res.status(401).send("Invalid username");
            return;
        }

        if (!user.checkPassword(password)) {
            res.status(401).send('Not allowed');
            return;
        }

        if (user.status !== 'ACTIVE') {
            res.status(403).send('Your account is not active')
            return;
        }
        
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role },  process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        })

        res.send(token);
    }

    // [GET] /projects
    async getProject(req: Request, res: Response) {
        const id: number = res.locals.jwtPayload.id
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

    // [GET] /:projectId/projects
    async getTask(req: Request, res: Response) {    
        const memberId: number = res.locals.jwtPayload.id
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

export default new MemberController();