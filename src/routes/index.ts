import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import adminRouter from "./admin"
import memberRouter from "./member"
import projectRouter from "./project"
import typeRouter from "./type"
import taskRouter from "./task"
import taskStatusRouter from "./taskStatus"
import taskPriorityRouter from "./taskPriority"
import MemberController from "../app/controllers/MemberController"

function route(app) {
    app.use('/type', typeRouter)
    app.use('/project', projectRouter)
    app.use('/task', taskRouter)
    app.use('/taskStatus', taskStatusRouter)
    app.use('/taskPriority', taskPriorityRouter)
    app.use('/', memberRouter)
    app.use('/', adminRouter)
    
    app.get('/', (req, res) => {
        res.send('Dashboard')
    })
}   

export default route