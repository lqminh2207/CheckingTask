import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import AdminController from '../app/controllers/AdminController';
import uploadCloud from '../app/configs/cloudinary.config';
const router = Router()

router.get('/listAll/:memberId([0-9]+)/projects/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], AdminController.getTask)
router.get('/listAll/:memberId([0-9]+)/projects', [checkJwt, checkRole(["ADMIN"])], AdminController.getProject)
router.patch('/listAll/:id([0-9]+)', uploadCloud.single("image"), [checkJwt, checkRole(["ADMIN"])], AdminController.updateUser)
router.delete('/listAll/:id([0-9]+)', [checkJwt, checkRole(["ADMIN"])], AdminController.deleteUser)
router.get('/listAll', [checkJwt, checkRole(["ADMIN"])], AdminController.listAll)

export default router
