import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import TaskStatusController from "../app/controllers/TaskStatusController"
const router = Router()

router.patch('/:taskStatusId([0-9]+)/changeStatus', [checkJwt, checkRole(["ADMIN"])], TaskStatusController.changeStatus)
router.patch('/:taskStatusId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], TaskStatusController.update)
router.post('/', [checkJwt, checkRole(["ADMIN"])], TaskStatusController.create)

export default router
