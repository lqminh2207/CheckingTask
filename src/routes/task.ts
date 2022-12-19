import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import TaskController from "../app/controllers/TaskController"
import { canUpdateAndDelete } from '../app/middlewares/checkControlPermission';
const router = Router()

router.patch('/:taskId([0-9]+)', [checkJwt, checkRole(["ADMIN", "MEMBER"]), canUpdateAndDelete], TaskController.update)
router.delete('/:taskId([0-9]+)', [checkJwt, checkRole(["ADMIN", "MEMBER"]), canUpdateAndDelete], TaskController.delete)
router.post('/', [checkJwt, checkRole(["ADMIN", "MEMBER"])], TaskController.create)
router.get('/', [checkJwt, checkRole(["ADMIN", "MEMBER"])], TaskController.getAllTask)

export default router
