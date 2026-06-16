import express from 'express';
import {signUpNewUser,signInUser,logout,getMe,forgotPassword,updateName,changePassword,deleteAccount} from '../controllers/authController.js'
import {protect} from '../middleware/authMiddleware.js'

const authRouter = express.Router();

authRouter.post('/signup',signUpNewUser)
authRouter.post('/login',signInUser)
authRouter.post('/logout',logout)
authRouter.post('/resetPassword',forgotPassword)
authRouter.get('/me',protect,getMe)
authRouter.patch('/update-name',protect,updateName)
authRouter.patch('/change-password',protect,changePassword)
authRouter.delete('/delete-account',protect,deleteAccount)

export default authRouter