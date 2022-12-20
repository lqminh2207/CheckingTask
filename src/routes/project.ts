import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import ProjectController from "../app/controllers/ProjectController"
const router = Router()

router.post('/:projectId([0-9]+)/addMember/:memberId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.addMember)
router.delete('/:projectId([0-9]+)/addMember/:memberId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.deleteMember)
router.patch('/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.update)
router.delete('/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.delete)
router.get('/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.getProjectDetail)
router.get('/', [checkJwt, checkRole(["ADMIN", "MEMBER"])], ProjectController.getAllProject)
router.post('/', [checkJwt, checkRole(["ADMIN"])], ProjectController.create)

export default router
