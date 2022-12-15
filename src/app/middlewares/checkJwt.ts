import { NextFunction, Response, Request } from 'express';
import * as jwt  from "jsonwebtoken"
import * as dotenv from 'dotenv'
dotenv.config()

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = <string>authHeader && authHeader.split(' ')[1]
    let jwtPayload

    // validate token and get data
    try {
        jwtPayload = <any>jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send(); // Token is invalid
        return;
    }

    const { id, username } = jwtPayload;
    const newToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '24h'
    })

    res.setHeader('token', newToken);
    next()
} 