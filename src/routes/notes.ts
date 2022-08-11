import express from 'express'
import {auth} from '../middleware/auth'

const router = express.Router();

import {Notes, getNotes, getAllNotes, getSingleNote,updateNotes,deleteNotes } from '../controller/noteController'

router.post('/create', auth, Notes)
router.post('/readall', getAllNotes)
router.get('/read',getNotes)
router.get('/read/:id', getSingleNote)
// router.patch('/update/:id', updateNotes)
router.post('/update/:id',auth,updateNotes)
router.get('/delete/:id', auth, deleteNotes)


export default router
