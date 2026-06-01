import {Link , useNavigate} from "react-router-dom"
import {Goal,Mail,ArrowLeft } from "lucide-react"

export default function ForgotPassword(){
    const navigate=useNavigate()

    function handleSubmit(e){
        e.preventDefault()
    }
    return(
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
                <form onSubmit={handleSubmit} className="mt-7">
                    <div className="mb-3">
                        <label className="font-medium block pb-1">Email</label>
                        <div className="relative">
                            <Mail size={20} className="absolute stroke-[#6a2fea] left-3 top-1/2 -translate-y-1/2"/>
                            <input type="email" placeholder="Enter your Email" className="w-full border-2 border-[#EEEEEE] focus:outline-none rounded-xl py-3 pl-10 pr-5 focus:ring-2 focus:ring-[#bdbdbd] " required/>
                        </div>
                    </div>
                    <button type="submit" className="py-2 border-2 border-[#ECECEC] font-semibold text-xl w-full rounded-2xl text-[#272727] cursor-pointer hover:text-[#E0BEF6] hover:bg-[#5919EA]">
                        Send Reset Link
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-5">
                        <ArrowLeft size={20} className="stroke-[#4A00C9] text-center"/>
                        <Link to="/register" className="text-[#4A00C9] cursor-pointer hover:underline underline-offset-4 font-medium">Back to Sign In</Link>
                    </div>
                </form>
            </div>
        </main>
    )
}