import { Request, Response } from 'express';
import { EntitySchema } from 'typeorm'
import { AppDataSource } from './../../data-source'

export const changeStatus = (entity: EntitySchema, modelName, repository, modelId) => {
    return async (req: Request, res: Response) => {
        const ACTIVE = 'ACTIVE'
        const INACTIVE = 'INACTIVE'

        const id: number = parseInt(req.params.modelId)
        let { status } = req.body;
        repository = AppDataSource.getRepository(entity)
        modelName: EntitySchema

        try {
            modelName = await repository.findOneByOrFail({ id: id })    
        } catch (error) {
            res.status(404).send(`${modelName} not found`);
            return; 
        }

        if (modelName.status === ACTIVE) {
            modelName.status = INACTIVE
        } else {
            modelName.status = ACTIVE
        }

        try {
            await repository.save(modelName);
        } catch (e) {
            res.status(409).send("Something went wrong");
            return;
        }

        res.status(204).send('Updated successfully!');
    }
}
