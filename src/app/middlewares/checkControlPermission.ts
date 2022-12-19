import { AppDataSource } from './../../data-source';
import { Task } from './../models/Task';
import { Request, Response, NextFunction } from 'express';

const canUpdateAndDelete = async (req: Request, res: Response, next: NextFunction) => {
    let taskId: number = parseInt(req.params.taskId)
    let task: Task

    try {
        task = await AppDataSource.getRepository(Task)
        .findOneOrFail({
            where: { id: taskId },
            loadRelationIds: true
        })
    } catch (error) {
        res.status(404).send("Task not found");
        return; 
    }

    if (res.locals.jwtPayload.role === 'ADMIN' || res.locals.jwtPayload.id === task.member) {
        next()
    } else {
        res.status(401).send("You don\'t have permission");
        return;
    }
}

const scopedProjects = (user, projects) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (res.locals.jwtPayload.role === 'ADMIN') {
           return projects
        } else {
           return projects.filter(project => project.userId === user.id)
        }
    }
}

export { canUpdateAndDelete, scopedProjects }