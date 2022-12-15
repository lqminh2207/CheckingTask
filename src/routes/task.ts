import { Router } from "express"
import TaskController from "../app/controllers/TaskController"
const router = Router()

router.get('/', (req, res) => {
    res.send('hi')
})

export default router
