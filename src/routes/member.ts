import { checkRole } from './../app/middlewares/checkRole';
import { checkJwt } from './../app/middlewares/checkJwt';
import { Router } from "express"
import MemberController from "../app/controllers/MemberController"
import uploadCloud from '../app/configs/cloudinary.config'
import passport = require('passport');
const router = Router()

router.get('/google', passport.authenticate('google'), (req, res) => {
    res.send(200)
})
router.get('/google/redirect', passport.authenticate('google', { failureRedirect: '/', failureMessage: true }), MemberController.loginWithGoogle)
router.post('/login', MemberController.login)
router.post('/register', uploadCloud.single('image'), MemberController.register)
router.post('/changePassword', MemberController.changePassword)
router.get('/:projectId([0-9]+)/projects', [checkJwt, checkRole(["MEMBER"])], MemberController.getTask)
router.get('/projects', [checkJwt, checkRole(["MEMBER"])], MemberController.getProject)

router.get('/', [checkJwt, checkRole(["ADMIN", "MEMBER"])], (req, res) => {
    res.send('Dashboard')
})

export default router
