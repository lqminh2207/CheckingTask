import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
// import * as express from "express"
import { Router } from "express"
import ProjectController from "../app/controllers/ProjectController"
const router = Router()

router.post('/getMem', [checkJwt, checkRole(["ADMIN"])], ProjectController.getMem)
router.post('/:projectId([0-9]+)/addMember/:memberId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.addMember)
router.delete('/:projectId([0-9]+)/addMember/:memberId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.deleteMember)
router.patch('/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.update)
router.delete('/:projectId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], ProjectController.delete)
router.post('/', [checkJwt, checkRole(["ADMIN"])], ProjectController.create)


export default router
