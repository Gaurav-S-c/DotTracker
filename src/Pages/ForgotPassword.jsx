import {Link , useNavigate} from "react-router-dom"
import { useState } from 'react'
import {Goal,Mail,ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function ForgotPassword(){
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)

    const navigate=useNavigate()

    const [email, setEmail]= useState('')

    const [sent, setSent]= useState(false)

    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const response=await fetch('http://localhost:3000/api/auth/resetPassword',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({email})
            })

            const data=await response.json()

            if(!response.ok){
                setError(data.error || 'Something went wrong. Try again.')
                return
            }
            setSent(true)
        }
        catch(err){
            setError('Something went wrong. Check your connection.')
        }finally {
            setLoading(false)
        }
    }

    if(sent)return(
        <main className="relative min-h-screen flex items-center justify-center">
      <img src="/forgotpassword-bg.png" className="object-cover h-screen w-full absolute inset-0" />
      <div className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 text-center">
        <div className='flex items-center justify-center gap-2 pb-5 text-[#4A00C9]'>
          <Goal className='size-10 stroke-[#6a2fea]'/>
          <Link to="/" className='font-bold text-3xl'>DotTracker</Link>
        </div>
        <div className="flex justify-center">
                    <img src="/email.png" className="w-40 object contain"/>
                </div>
        <p className="font-bold text-lg text-[#4A00C9]">Check your inbox!</p>
        <p className="text-[#494456] mt-2">
          We sent a reset link to <strong>{email}</strong>.
          Click the link in the email to reset your password.
        </p>
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 mt-6 text-[#4A00C9] font-medium hover:underline underline-offset-4"
          >
          <ArrowLeft size={18}/> Back to Sign In
        </Link>
      </div>
    </main>
    )

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
        <main className="relative min-h-screen flex items-center justify-center">
            <img src="/forgotpassword-bg.png" alt="sign-in background image" className="object-cover h-screen w-full absolute inset-0" />
            <div className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
                <div className='flex items-center justify-center gap-2 pb-3 text-[#4A00C9] text-center'>
                    <Goal className='size-10 stroke-[#6a2fea]'/>
                    <Link to="/" className='font-bold text-3xl'>DotTracker</Link>
                </div>
                <div className="flex justify-center">
                    <img src="/email.png" className="w-40 object contain"/>
                </div>
                <p className="text-center font-medium text-lg text-[#4A00C9]">Forgot your Password ?</p>
                <p className="text-center text-[#494456]">No worries! Enter your email and we'll send you a link to reset your password</p>
                {error && (
                    <p className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-xl mb-3">
                        {error}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="mt-7">
                    <div className="mb-3">
                        <label className="font-medium block pb-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute stroke-[#6a2fea] left-3 top-1/2 -translate-y-1/2"/>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Enter your Email" 
                                className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd] " 
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="py-2 border-2 border-[#ECECEC] font-semibold text-xl w-full rounded-2xl text-[#272727] cursor-pointer hover:text-[#E0BEF6] hover:bg-[#5919EA]">
                        Send Reset Link
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-5">
                        <ArrowLeft size={20} className="stroke-[#4A00C9] text-center"/>
                        <Link to="/login" className="text-[#4A00C9] cursor-pointer hover:underline underline-offset-4 font-medium">Back to Sign In</Link>
                    </div>
                </form>
            </div>
        </main>
        </motion.div>
    )
}