import express from "express"

import { getForm,insertData,updateForm,deleteForm} from "./controllers/applicationForm"

const formsRouter=express.router()

formsRouter.get('/',getForm)
formsRouter.post('/',insertData)
formsRouter.patch('/id',updateForm)
formsRouter.delete('/id',deleteForm)
