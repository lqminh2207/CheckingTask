import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import MemberController from "../app/controllers/MemberController"
const router = Router()

router.post('/register', MemberController.register)
router.get('/:projectId([0-9]+)/project', [checkJwt, checkRole(["ADMIN"])], MemberController.getProject)


export default router
