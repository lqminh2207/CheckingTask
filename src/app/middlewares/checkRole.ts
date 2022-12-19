import { NextFunction, Response, Request } from 'express';

export const checkRole = (roles: Array<string>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Get Id from previous middleware
        const role = res.locals.jwtPayload.role

        if (roles.indexOf(role) > -1) {
            next()
        } else {
            res.status(401).send('You don\'t have permission')
        }
    }
} 