import { Member } from './../models/Member';
import { validate } from 'class-validator';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Project } from '../models/Project';
import { compareDateNow, compareTwoDate } from '../commons/compareDate';

class ProjectController {
    // [GET] /project
    async getAllProject(req: Request, res: Response) {
        let projectRepo = AppDataSource.getRepository(Project)
        try {
            const projects = await projectRepo.createQueryBuilder().getMany()
        } catch (error) {
            res.status(404).send('Something went wrong')
            return 
        }
    }

    // [POST] /project
    async create(req: Request, res: Response) {
        let { name, startDate, endDate } = req.body;
        const project = new Project()
        project.name = name
        project.startDate = startDate
        project.endDate = endDate

        let num1 = compareDateNow(project.startDate)
        let num2 = compareDateNow(project.endDate)
        let num3 = compareTwoDate(project.startDate, project.endDate)

        if (num1 === -1 || num2 === -1) {
            res.status(400).send('Start date and end date must be come after current date');
            return;
        }

        if (num3 === 1) {
            res.status(400).send('Start date must be come before end date');
            return;
        }
        
        const errors = await validate(project);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        project.createSlug()

        const userRepo = AppDataSource.getRepository(Project)
        try {
            await userRepo.save(project)
            res.status(201).send("Project created");
        } catch (error) {
            res.status(409).send("Something went wrong");
            return;
        }
    }

    // [PATCH] /project/:projectId
    async update(req: Request, res: Response) {
        const id: number = parseInt(req.params.projectId)
        let { name, startDate, endDate } = req.body;
        const projectRepo = AppDataSource.getRepository(Project)
        let project: Project

        try {
            project = await projectRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("Project not found");
            return; 
        }

        project.name = name
        project.startDate = startDate
        project.endDate = endDate
        const errors = await validate(project);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        let num1 = compareDateNow(project.startDate)
        let num2 = compareDateNow(project.endDate)
        let num3 = compareTwoDate(project.startDate, project.endDate)

        if (num1 === -1 || num2 === -1) {
            res.status(400).send('Start date and end date must be come after current date');
            return;
        }

        if (num3 === 1) {
            res.status(400).send('Start date must be come before end date');
            return;
        }
        project.createSlug()

        try {
            await projectRepo.save(project);
        } catch (e) {
            res.status(409).send("Project name already in use");
            return;
        }

        res.status(204).send('Updated successfully!');
    }

    // [DELETE] /project/:projectId
    async delete(req: Request, res: Response) {
        const id: number = parseInt(req.params.projectId);
        const projectRepo = AppDataSource.getRepository(Project)
        let project: Project

        try {
            project = await projectRepo.findOneByOrFail({ id: id });
        } catch (error) {
            res.status(404).send("Project not found");
            return; 
        }
        
        projectRepo.delete(id)
        res.status(204).send('Delete successfully!');
    }

    // [POST] /project/:projectId/addMember/:memberId
    async addMember(req: Request, res: Response) {
        let member: Member
        const memberId = parseInt(req.params.memberId)

        try {
            member = await AppDataSource.getRepository(Member).findOneByOrFail({ id : memberId })
        } catch (error) {
            res.status(404).send("Member not found");
            return
        }

        const projectId = parseInt(req.params.projectId)
        try {
            await AppDataSource.createQueryBuilder().relation(Project, "members").of(projectId).add(member)
            res.status(201).send("Successfully");
        } catch (error) {
            res.status(404).send("Something went wrong");
            return
        }
    }

    // [DELETE] /project/:projectId/addMember/:memberId
    async deleteMember(req: Request, res: Response) {
        let member: Member

        try {
            member = await AppDataSource.getRepository(Member).findOneByOrFail({ id : parseInt(req.params.memberId)})
        } catch (error) {
            res.status(404).send("Member not found");
            return
        }

        const projectId = parseInt(req.params.projectId)
        if (!await AppDataSource.getRepository(Project).findOneBy({ id: projectId })) {
            res.status(404).send("Project not found");
            return
        }
        
        try {
            await AppDataSource.createQueryBuilder().relation(Project, "members").of(projectId).remove(member)
            res.status(201).send("Successfully");
        } catch (error) {
            res.status(404).send("Something went wrong");
            return
        }
    }
}

export default new ProjectController();