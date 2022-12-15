import { MinDate } from 'class-validator';
import { validate } from 'class-validator';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { Project } from '../models/Project';
import { compareDateNow, compareTwoDate } from '../commons/compareDate';

class ProjectController {
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
}

export default new ProjectController();