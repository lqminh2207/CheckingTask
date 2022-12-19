import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import MemberController from "../app/controllers/MemberController"
const router = Router()

router.post('/login', MemberController.login)
router.post('/register', MemberController.register)
router.get('/:projectId([0-9]+)/projects', [checkJwt, checkRole(["MEMBER"])], MemberController.getTask)
router.get('/projects', [checkJwt, checkRole(["MEMBER"])], MemberController.getProject)

export default router
