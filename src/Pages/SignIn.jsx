import {Goal,Mail,Lock,Eye,EyeOff } from "lucide-react"
import { useState } from "react"
import {Link,useNavigate} from "react-router-dom"
import ForgotPassword from "./ForgotPassword"


export default function SignIn(){
    const [error,setError]=useState('')
    const [loading,setLoading]=useState(false)

    const navigate=useNavigate()
    
    const [form,setForm]=useState({email:'',password:''})
    
    const handleChange=(e)=>
        setForm({...form,[e.target.name]:e.target.value})
    
    const [showPassword,setShowPassword]=useState(false)
    
    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const response =await fetch('http://localhost:3000/api/auth/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    email:form.email,
                    password:form.password
                })
            })
            const data=await response.json()

            if(!response.ok){
                setError(data.error || 'Login failed, Try again.')
                return 
            }

            localStorage.setItem('token',data.token)
            localStorage.setItem('user',JSON.stringify(data.user))
            localStorage.setItem('refresh_token', data.refresh_token)
            
            navigate("/dashboard")
        }
        catch(err){
            setError('Something went wrong. Check your connection.')
        }finally{
            setLoading(false)
        }
    }

    return(
        <main className="relative min-h-screen flex items-center justify-center">
            <img src="/signin-bg.png" alt="sign-in background image" className="object-cover h-screen w-full absolute inset-0" />
            <div className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">
                <div className='flex items-center justify-center gap-2 pb-3 text-[#4A00C9] text-center'>
                    <Goal className='size-10 stroke-[#6a2fea]'/>
                    <Link to="/" className='font-bold text-3xl'>DotTracker</Link>
                </div>
                <p className="text-center font-medium text-lg">Welcome Back!</p>
                <p className="text-center text-[#494456]">Nice to see you again.👋</p>
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
                            <input type="email" name="email" placeholder="Enter your Email" value={form.email} onChange={handleChange} className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd] " required/>
                        </div>
                    </div>
                    <div>
                        <label className="font-medium block pb-1">Password</label>
                        <div className="relative">
                            <Lock size={20} className="absolute stroke-[#6a2fea] left-3 top-1/2 -translate-y-1/2"/>
                            <input type={showPassword?"text":"password"} name="password" placeholder="Enter your password" value={form.password} onChange={handleChange} className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd]" required/>
                            {showPassword?  
                                <EyeOff size={20} className="absolute stroke-[#6a2fea] right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(false)}/>
                                :   
                                <Eye size={20} className="absolute stroke-[#6a2fea] right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(true)}/>
                            }
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-5 mb-5">
                        <label className="flex items-center gap-2 tex-sm hover:underline cursor-pointer underline-offset-4 hover:text-[#4A00c9] text-[#494456] px-2"><input type="checkbox"/> Remember me</label>
                        <Link to="/forgot-password" className="text-[#4A00C9] cursor-pointer">Forgot Password?</Link>
                    </div>
                    <button type="submit" disabled={loading} className="py-2 border-2 border-[#ECECEC] font-semibold text-xl w-full rounded-2xl text-[#272727] cursor-pointer hover:text-[#E0BEF6] hover:bg-[#5919EA] disabled:opacity-60">
                        {loading ? 'Signing in...': 'Sign in'}
                    </button>
                    <p className="text-center mt-4 font-medium">Don't have an account? <Link to="/register" className="text-[#4A00C9] cursor-pointer hover:underline underline-offset-4">Sign Up</Link></p>
                </form>
            </div>
        </main>
    )
}