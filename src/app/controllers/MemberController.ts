import { Project } from './../models/Project';
import { Task } from './../models/Task';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Member } from './../models/Member';
import * as jwt  from "jsonwebtoken" 
import { validate } from 'class-validator';
import * as bcrypt from 'bcrypt'
import * as dotenv from 'dotenv'

class MemberController {
    // [POST] /register
    async register(req: Request, res: Response) {
        let { username, password, email, dob, image, projectId } = req.body;
        const user = new Member()
        user.username = username
        user.password = password
        user.email = email
        user.dob = dob
        user.image = image
        user.inviteId = jwt.sign({ projectId }, process.env.INVITE_TOKEN_SECRET, {
            expiresIn: '1d'
        })

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
        let { username, password, inviteId } = req.body;
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

        if (user.inviteId != null) {
            if (inviteId == undefined) {
                res.status(401).send('Please enter your invite ID');
                return;
            } else {
                let member: Member
                const memberId = user.id
                let projectId = jwt.verify(user.inviteId, process.env.INVITE_TOKEN_SECRET)
                res.locals.jwtPayload = projectId

                member = await AppDataSource.getRepository(Member).findOneByOrFail({ id : memberId })

                try {
                    await AppDataSource.createQueryBuilder().relation(Project, "members").of(res.locals.jwtPayload.projectId).add(member)
                    user.inviteId = null
                    await AppDataSource.getRepository(Member).save(user)
                } catch (error) {
                    console.log(error)
                    res.status(404).send("Something went wrong");
                    return
                }
            }
        } 

        if (!user.checkPassword(password)) {
            res.status(401).send('Not allowed');
            return;
        }

        if (user.status !== 'ACTIVE') {
            res.status(403).send('Your account is not active')
            return;
        }
        
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '7d'
        })

        res.send(token);
    }

    loginWithGoogle (req: Request, res: Response) {
        if (req.user) {
            const token = jwt.sign({ id: req.user['id'], username: req.user['username'], role: req.user['role'] }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '7d'
            })
    
            res.send(token)
        }
    }
    
    // [POST] /changePassword
    async changePassword (req: Request, res: Response) {
        let { username, password, newPassword, confirmPassword } = req.body;
        if (!(username && password && confirmPassword)) {
            res.status(400).send("Please enter a username, password and confirmPassword");
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

        if (user.status !== 'ACTIVE') {
            res.status(403).send('Your account is not active')
            return;
        }

        if (!user.checkPassword(password)) {
            res.status(401).send('Password is incorrect');
            return;
        }

        if (bcrypt.compareSync(newPassword, user.password)) {
            res.status(401).send('New password have to differentiate from old password');
            return;
        }

        if (newPassword !== confirmPassword) {
            res.status(401).send("Confirm password have to same as your password");
            return;
        }
        
        user.password = newPassword
        user.inviteId = null

        user.hashPassword() 
        try {
            await userRepo.save(user)
            res.status(204).send('Successfully');
        } catch (error) {
            res.status(404).send('Error')
            return
        }
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