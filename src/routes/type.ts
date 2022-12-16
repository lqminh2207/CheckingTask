import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import TypeController from "../app/controllers/TypeController"
const router = Router()

router.patch('/:typeId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], TypeController.update)
router.patch('/:typeId([0-9]+)/changeStatus', [checkJwt, checkRole(["ADMIN"])], TypeController.changeStatus)
router.delete('/:typeId([0-9]+)', [checkJwt, checkRole(["ADMIN"])], TypeController.delete)
router.post('/', [checkJwt, checkRole(["ADMIN"])], TypeController.create)

export default router

