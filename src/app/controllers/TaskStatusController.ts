import { validate } from 'class-validator';
import { TaskStatus } from './../models/TaskStatus';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";

class TaskStatusController {
        // [POST] /taskStatus
        async create(req: Request, res: Response) {
            let { statusName, order, status } = req.body;
            const taskStatus = new TaskStatus()
            taskStatus.statusName = statusName
            taskStatus.order = order
            taskStatus.status = status
    
            const errors = await validate(taskStatus);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
            
            const userRepo = AppDataSource.getRepository(TaskStatus)
            try {
                await userRepo.save(taskStatus)
                res.status(201).send("TaskStatus created");
            } catch (error) {
                res.status(409).send("Something went wrong");
                return;
            }
        }
    
        // [PATCH] /taskStatus/:taskStatusId
        async update(req: Request, res: Response) {
            const id: number = parseInt(req.params.taskStatusId)
            let { statusName, order, status } = req.body;
            const taskStatusRepo = AppDataSource.getRepository(TaskStatus)
            let taskStatus: TaskStatus
    
            try {
                taskStatus = await taskStatusRepo.findOneByOrFail({ id: id })    
            } catch (error) {
                res.status(404).send("TaskStatus not found");
                return; 
            }
    
            taskStatus.statusName = statusName
            taskStatus.order = order
            taskStatus.status = status
            const errors = await validate(taskStatus);
            if (errors.length > 0) {
                res.status(400).send(errors);
                return;
            }
    
            try {
                await taskStatusRepo.save(taskStatus);
            } catch (e) {
                res.status(409).send("TaskStatus name already in use");
                return;
            }
    
            res.status(204).send('Updated successfully!');
        }
    
        // [DELETE] /taskStatus/:taskStatusId
        async delete(req: Request, res: Response) {
            const id: number = parseInt(req.params.taskStatusId);
            const taskStatusRepo = AppDataSource.getRepository(TaskStatus)
            let taskStatus: TaskStatus
            
            try {
                taskStatus = await taskStatusRepo.findOneByOrFail({ id: id });
            } catch (error) {
                res.status(404).send("TaskStatus not found");
                return; 
            }
            
            taskStatusRepo.delete(id)
            res.status(204).send('Delete successfully!');
        }
}

export default new TaskStatusController();