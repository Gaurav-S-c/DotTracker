import express from "express"
import {protect} from '../middleware/authMiddleware.js'
import { getForm,insertData,updateForm,deleteForm} from "../controllers/applicationForm.js"

const formsRouter=express.Router()

formsRouter.use(protect)

formsRouter.get('/',getForm)
formsRouter.post('/',insertData)
formsRouter.patch('/:id',updateForm)
formsRouter.delete('/:id',deleteForm)

export default formsRouter
