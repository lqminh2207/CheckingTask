import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import TaskPriorityController from "../app/controllers/TaskPriorityController"
const router = Router()

router.patch('/:taskPriorityId([0-9]+)/changeStatus', [checkJwt, checkRole(["ADMIN"])], TaskPriorityController.changeStatus)
router.patch('/:taskPriorityId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], TaskPriorityController.update)
router.post('/', [checkJwt, checkRole(["ADMIN"])], TaskPriorityController.create)

export default router
