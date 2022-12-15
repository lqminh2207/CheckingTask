// import * as express from "express"
import { Router } from "express"
import TaskPriorityController from "../app/controllers/TaskPriorityController"
const router = Router()

router.get('/', (req, res) => {
    res.send('hi')
})

export default router
