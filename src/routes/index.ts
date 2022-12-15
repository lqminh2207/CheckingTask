import adminRouter from "./admin"
import memberRouter from "./member"
import projectRouter from "./project"
import typeRouter from "./type"
import taskRouter from "./task"
import taskStatusRouter from "./taskStatus"
import taskPriorityRouter from "./taskPriority"
import MemberController from "../app/controllers/MemberController"
// import { AppDataSource } from './../data-source';
// import { Member } from '../app/models/Member';

function route(app) {
    app.use('/type', typeRouter)
    app.use('/project', projectRouter)
    app.use('/task', taskRouter)
    app.use('/taskStatus', taskStatusRouter)
    app.use('/taskPriority', taskPriorityRouter)
    
    app.use('/member', memberRouter)
    app.use('/admin', adminRouter)

    app.post('/login', MemberController.login)
    app.post('/register', MemberController.register)
    
    app.get('/', (req, res) => {
        res.send('Dashboard')
    })
}   

export default route