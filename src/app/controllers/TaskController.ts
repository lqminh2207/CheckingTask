import { TaskPriority } from './../models/TaskPriority';
import { TaskStatus } from './../models/TaskStatus';
import { Project } from './../models/Project';
import { validate } from 'class-validator';
import { Task } from './../models/Task';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";
import { compareDateNow, compareTwoDate } from '../commons/compareDate';

class TaskController {
    // [POST] /task
    async create(req: Request, res: Response) {

        let { projectId, memberId, taskStatusId, typeId, taskPriorityId, name, startDate, endDate } = req.body;
        const task = new Task()
        task.project = projectId
        task.member = memberId
        task.taskStatus = taskStatusId
        task.taskPriority = taskPriorityId
        task.type = typeId
        task.name = name
        task.startDate = startDate
        task.endDate = endDate

        if (task.member == null) {
            task.member = res.locals.jwtPayload.id
        }

        let project: Project
        try {
            project = await AppDataSource.getRepository(Project)
            .findOneByOrFail({ id: req.body.projectId })
        } catch (error) {
            res.status(404).send("Project not found");
            return; 
        }

        let num1 = compareDateNow(task.startDate)
        let num2 = compareDateNow(task.endDate)
        let num3 = compareTwoDate(task.startDate, task.endDate)
        let num4 = compareTwoDate(task.startDate, project.startDate)
        let num5 = compareTwoDate(task.endDate, project.endDate)

        if (num1 === -1 || num2 === -1) {
            res.status(400).send('Start date and end date must be come after current date');
            return;
        }

        if (num3 === 1) {
            res.status(400).send('Start date must be come before end date');
            return;
        }

        if (num4 === -1 || num5 === 1) {
            res.status(400).send('Start date and end date must be in range from start date to end date of project');
            return;
        }

        const errors = await validate(task);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        const userRepo = AppDataSource.getRepository(Task)
        try {
            await userRepo.save(task)
            res.status(201).send("Task created");
        } catch (error) {
            res.status(409).send("Something went wrong");
            return;
        }
    }

    // [PATCH] /task/:taskId
    async update(req: Request, res: Response) {
        const id: number = parseInt(req.params.taskId)
        let { projectId, memberId, taskStatusId, typeId, taskPriorityId, name, startDate, endDate } = req.body;
        const taskRepo = AppDataSource.getRepository(Task)
        let task: Task

        try {
            task = await taskRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("Task not found");
            return; 
        }

        task.project = projectId
        task.member = memberId
        task.taskStatus = taskStatusId
        task.taskPriority = taskPriorityId
        task.type = typeId
        task.name = name
        task.startDate = startDate
        task.endDate = endDate

        let project: Project
        try {
            project = await AppDataSource.getRepository(Project)
            .findOneByOrFail({ id: req.body.projectId })
        } catch (error) {
            res.status(404).send("Project not found");
            return; 
        }

        let num1 = compareDateNow(task.startDate)
        let num2 = compareDateNow(task.endDate)
        let num3 = compareTwoDate(task.startDate, task.endDate)
        let num4 = compareTwoDate(task.startDate, project.startDate)
        let num5 = compareTwoDate(task.endDate, project.endDate)

        if (num1 === -1 || num2 === -1) {
            res.status(400).send('Start date and end date must be come after current date');
            return;
        }

        if (num3 === 1) {
            res.status(400).send('Start date must be come before end date');
            return;
        }

        if (num4 === -1 || num5 === 1) {
            res.status(400).send('Start date and end date must be in range from start date to end date of project');
            return;
        }

        const errors = await validate(task);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await taskRepo.save(task);
        } catch (error) {
            res.status(409).send("Task name already in use");
            return;
        }

        res.status(204).send('Updated successfully!');
    }

    // [DELETE] /task/:taskId
    async delete(req: Request, res: Response) { 
        const id: number = parseInt(req.params.taskId);
        const taskRepo = AppDataSource.getRepository(Task)
        let task: Task
        
        try {
            task = await taskRepo.findOneByOrFail({ id: id });
        } catch (error) {
            res.status(404).send("Task not found");
            return; 
        }
        
        taskRepo.delete(id)
        res.status(204).send('Delete successfully!');
    }

    // [GET] /task
    async getAllTask(req: Request, res: Response) {
        const role = res.locals.jwtPayload.role
        const taskRepo = AppDataSource.getRepository(Task)
        let query

        // List all tasks filter by status
        // let taskStatus: TaskStatus
        // if (req.query.hasOwnProperty('status')) {
        //     res.locals.status = req.query.status
        // } else {
        //     res.status(404).send("Something went wrong");
        //     return
        // }

        // try {
        //     taskStatus = await AppDataSource.getRepository(TaskStatus)
        //     .findOneOrFail({
        //         select: ['id'],
        //         where: { statusName: res.locals.status }
        //     })
        // } catch (error) {
        //     res.status(404).send("Cannot find status");
        //     return
        // }

        // try {
        //     if (role === 'ADMIN') {
        //         query = await taskRepo.createQueryBuilder('task')
        //         .loadAllRelationIds()
        //         .leftJoinAndSelect(TaskPriority, 'tp', 'tp.id = task.taskPriorityId')
        //         .where({ taskStatus: taskStatus.id })
        //         .orderBy('tp.order')
        //         .getMany()
        //     } else {
        //         query = await taskRepo.createQueryBuilder('task')
        //         .loadAllRelationIds()
        //         .leftJoinAndSelect(TaskPriority, 'tp', 'tp.id = task.taskPriorityId')
        //         .where({ taskStatus: taskStatus.id, member: res.locals.jwtPayload.id })
        //         .orderBy('tp.order')
        //         .getMany()
        //     }
            
    
        //     res.send(query)
        // } catch (error) {
        //     res.status(404).send("Something went wrong");
        //     return
        // }

        // List full
        try {
            if (role === 'ADMIN') {
                query = await taskRepo.createQueryBuilder('task')
                .loadAllRelationIds().leftJoinAndSelect(TaskPriority, 'tp', 'tp.id = task.taskPriorityId')
                .orderBy('tp.order')
                .getMany()
            } else {
                query = await taskRepo.createQueryBuilder('task')
                .loadAllRelationIds().leftJoinAndSelect(TaskPriority, 'tp', 'tp.id = task.taskPriorityId')
                .where({ member: res.locals.jwtPayload.id })
                .orderBy('tp.order')
                .getMany()
            }
    
            res.send(query)
        } catch (error) {
            console.log(error)
            res.status(404).send("Something went wrong");
            return
        }
    }
}

export default new TaskController();