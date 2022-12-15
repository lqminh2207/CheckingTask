import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import AdminController from '../app/controllers/AdminController';
const router = Router()

router.post('/register', AdminController.register)
router.get('/listAll/:projectId([0-9]+)/projects/:taskId([0-9]+)/tasks', [checkJwt, checkRole(["ADMIN"])], AdminController.getTask)
router.get('/listAll/:projectId([0-9]+)/project', [checkJwt, checkRole(["ADMIN"])], AdminController.getProject)
router.patch('/listAll/:id([0-9]+)', [checkJwt, checkRole(["ADMIN"])], AdminController.updateUser)
router.delete('/listAll/:id([0-9]+)', [checkJwt, checkRole(["ADMIN"])], AdminController.deleteUser)
router.get('/listAll', [checkJwt, checkRole(["ADMIN"])], AdminController.listAll)

export default router
