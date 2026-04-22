import express from 'express';
import {signUpNewUser,signInUser,logout,getMe,forgotPassword} from '../controllers/authController.js'
import {protect} from '../middleware/authMiddleware.js'

const authRouter = express.Router();

authRouter.post('/signup',signUpNewUser)
authRouter.post('/login',signInUser)
authRouter.post('/logout',logout)
authRouter.post('/resetPassword',forgotPassword)
authRouter.get('/me',protect,getMe)

export default authRouter