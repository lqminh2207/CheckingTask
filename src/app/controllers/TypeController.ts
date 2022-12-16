import { validate } from 'class-validator';
import { Type } from './../models/Type';
import { AppDataSource } from '../../data-source';
import { Request, Response } from "express";

class TypeController {
    // [POST] /type
    async create(req: Request, res: Response) {
        let { name, color, status } = req.body;
        const type = new Type()
        type.name = name
        type.color = color
        type.status = status

        const errors = await validate(type);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }
        
        const userRepo = AppDataSource.getRepository(Type)
        try {
            await userRepo.save(type)
            res.status(201).send("Type created");
        } catch (error) {
            res.status(409).send("Something went wrong");
            return;
        }
    }

    // [PATCH] /type/:typeId
    async update(req: Request, res: Response) {
        const id: number = parseInt(req.params.typeId)
        let { name, color, status } = req.body;
        const typeRepo = AppDataSource.getRepository(Type)
        let type: Type

        try {
            type = await typeRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("Type not found");
            return; 
        }

        type.name = name
        type.color = color
        type.status = status
        const errors = await validate(type);
        if (errors.length > 0) {
            res.status(400).send(errors);
            return;
        }

        try {
            await typeRepo.save(type);
        } catch (e) {
            res.status(409).send("Type name already in use");
            return;
        }

        res.status(204).send('Updated successfully!');
    }

    // [DELETE] /type/:typeId
    async delete(req: Request, res: Response) {
        const id: number = parseInt(req.params.typeId);
        const typeRepo = AppDataSource.getRepository(Type)
        let type: Type

        try {
            type = await typeRepo.findOneByOrFail({ id: id });
        } catch (error) {
            res.status(404).send("Type not found");
            return; 
        }
        
        typeRepo.delete(id)
        res.status(204).send('Delete successfully!');
    }

     // [PATCH] /type/:typeId/changeStatus
     async changeStatus(req: Request, res: Response) {
        const ACTIVE = 'ACTIVE'
        const INACTIVE = 'INACTIVE'

        const id: number = parseInt(req.params.typeId)
        let { status } = req.body;
        const typeRepo = AppDataSource.getRepository(Type)
        let type: Type

        try {
            type = await typeRepo.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send("Type not found");
            return; 
        }

        if (type.status === ACTIVE) {
            type.status = INACTIVE
        } else {
            type.status = ACTIVE
        }

        try {
            await typeRepo.save(type);
        } catch (e) {
            res.status(409).send("Something went wrong");
            return;
        }

        res.status(204).send('Updated successfully!');
    }
}

export default new TypeController();