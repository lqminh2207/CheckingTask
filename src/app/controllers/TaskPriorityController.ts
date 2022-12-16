import { validate } from 'class-validator';
import { TaskPriority } from './../models/TaskPriority';
import { AppDataSource } from '../../data-source';
import { DataSource, getConnection, getRepository } from "typeorm";
import { Request, Response } from "express";

class TaskPriorityController {
     // [POST] /taskPriority
     async create(req: Request, res: Response) {
        let { name, order, status } = req.body;
        const taskPriority = new TaskPriority()
        taskPriority.name = name
        taskPriority.order = order
        taskPriority.status = status

        const errors = await validate(taskPriority);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        const userRepo = AppDataSource.getRepository(TaskPriority)
        try {
            await userRepo.save(taskPriority)
            res.status(201).send("TaskPriority created");
        } catch (error) {
            res.status(409).send("Something went wrong");
            return;
        }
    }

    // [PATCH] /taskPriority/:taskPriorityId
    async update(req: Request, res: Response) {
        const id: number = parseInt(req.params.taskPriorityId)
        let { name, order, status } = req.body;
        const taskPriorityRepo = AppDataSource.getRepository(TaskPriority)
        let taskPriority: TaskPriority

        try {
            taskPriority = await taskPriorityRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("TaskPriority not found");
            return; 
        }

        taskPriority.name = name
        taskPriority.order = order
        taskPriority.status = status
        const errors = await validate(taskPriority);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await taskPriorityRepo.save(taskPriority);
        } catch (e) {
            res.status(409).send("TaskPriority name already in use");
            return;
        }

        res.status(204).send('Updated successfully!');
    }

    // [PATCH] /TaskPriority/:taskPriorityId/changeStatus
    async changeStatus(req: Request, res: Response) {
        const ACTIVE = 'ACTIVE'
        const INACTIVE = 'INACTIVE'

        const id: number = parseInt(req.params.taskPriorityId)
        let { status } = req.body;
        const taskPriorityRepo = AppDataSource.getRepository(TaskPriority)
        let taskPriority: TaskPriority

        try {
            taskPriority = await taskPriorityRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("Status not found");
            return; 
        }

        if (taskPriority.status === ACTIVE) {
            taskPriority.status = INACTIVE
        } else {
            taskPriority.status = ACTIVE
        }

        try {
            await taskPriorityRepo.save(taskPriority);
        } catch (e) {
            res.status(409).send("Something went wrong");
            return;
        }

        res.status(204).send('Updated successfully!');
    }
}

export default new TaskPriorityController();