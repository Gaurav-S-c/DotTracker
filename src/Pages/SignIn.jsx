import {Goal,Mail,Lock,Eye } from "lucide-react"
import {Link,useNavigate} from "react-router-dom"


export default function SignIn(){
    const navigate=useNavigate()

    function handleSubmit(e){
        e.preventDefault()
        navigate("/dashboard")
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
                <form onSubmit={handleSubmit} className="mt-7">
                    <div className="mb-3">
                        <label className="font-medium block pb-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute stroke-[#6a2fea] left-3 top-1/2 -translate-y-1/2"/>
                            <input type="email" placeholder="Enter your Email" className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd] " required/>
                        </div>
                    </div>
                    <div>
                        <label className="font-medium block pb-1">Password</label>
                        <div className="relative">
                            <Lock size={20} className="absolute stroke-[#6a2fea] left-3 top-1/2 -translate-y-1/2"/>
                            <input type="password" placeholder="Enter your password" className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd]" required/>
                            <Eye size={20} className="absolute stroke-[#6a2fea] right-3 top-1/2 -translate-y-1/2 cursor-pointer"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-5 mb-5">
                        <label className="flex items-center gap-2 tex-sm hover:underline cursor-pointer underline-offset-4 hover:text-[#4A00c9] text-[#494456] px-2"><input type="checkbox"/> Remember me</label>
                        <Link to="/forgot-password" className="text-[#4A00C9] cursor-pointer">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="py-2 border-2 border-[#ECECEC] font-semibold text-xl w-full rounded-2xl text-[#272727] cursor-pointer hover:text-[#E0BEF6] hover:bg-[#5919EA]">
                        Sign in
                    </button>
                    <p className="text-center mt-4 font-medium">Don't have an account? <Link to="/register" className="text-[#4A00C9] cursor-pointer hover:underline underline-offset-4">Sign Up</Link></p>
                </form>
            </div>
        </main>
    )
}