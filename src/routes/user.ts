import express from 'express'
const router = express.Router();
import {RegisterUser,LoginUser,getUsers} from '../controller/userController'

router.post('/register', RegisterUser)
router.post('/login', LoginUser)
router.get('/allusers', getUsers)


export default router
