import express from 'express'
import { dashboard, showLogin, showRegister, updateNote } from '../controller/pageController'

const router = express.Router();

router.get('/', dashboard)
router.get('/login', showLogin)
router.get('/register', showRegister)
router.get('/update/:id', updateNote)
// router.post('/delete', deleteNote)


export default router