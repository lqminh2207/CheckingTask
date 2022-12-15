import { AppDataSource } from './../../data-source';
import { Member } from './../models/Member';
import { NextFunction, Response, Request } from 'express';
import { getRepository } from 'typeorm';

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Get Id from previous middleware
        const id = res.locals.jwtPayload.id

        const userRepo = AppDataSource.getRepository(Member)
        let user: Member
        
        try {
            user = await userRepo.findOneOrFail({ where: { id: id } })
        } catch (error) {
            res.status(401).send();
        }

        if (roles.indexOf(user.role) > -1) {
            next()
        } else {
            res.status(401).send('You don\'t have permission')
        }
    }
} 