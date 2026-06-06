import { Sparkles,SquareKanban,ClipboardList, FileSearch ,FileText,Goal,LogOut} from "lucide-react"
import {Link,useNavigate} from "react-router-dom"
import { useState } from "react"

export default function Home(){
const navigate=useNavigate()
const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'))

    const handleLogOut=()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setIsLoggedIn(false)
        Navigate('/')
    }
    
    return(
        <>
            <header className="flex justify-between px-8 items-center h-13 bg-[#fdf9ff] border-b border-[#f9e9fe] fixed top-0 left-0 w-full z-50">
                <div className="flex items-center gap-2">
                    <Goal className='size-10 stroke-[#6a2fea]'/>
                    <a href="#home" className="font-bold text-3xl text-[#4A00C9] cursor-pointer">DotTracker</a>
                </div>
                <div className="flex justify-between w-70 font-medium text-[#494456]">
                    <a href="#features" className="hover:text-[#4A00C9] hover:underline underline-offset-4 cursor-pointer">Features</a>
                    <a href="#about" className="hover:text-[#4A00C9] hover:underline underline-offset-4 cursor-pointer">About</a>
                    <Link to="/dashboard" className="hover:text-[#4A00C9] hover:underline underline-offset-4 cursor-pointer">Dashboard</Link>
                </div>
                <div className="flex justify-between w-35 font-medium text-[#494456]">
                    {isLoggedIn ? (
                        <button onClick={handleLogOut} className="flex items-center gap-3 cursor-pointer mt-auto border-3 border-red-500 rounded-full px-2 py-1 bg-red-500 text-white hover:bg-red-600 hover:border-red-600 hover:bg-transition-colors">
                            Logout
                            <LogOut/>
                        </button>
                    ):(
                        <>
                            <Link to="/login" className="cursor-pointer rounded-full hover:bg-[#4A00C9] px-2 py-1 hover:text-[#FDF7FF]">Sign In</Link>
                            <Link to="/register" className="cursor-pointer rounded-full hover:bg-[#4A00C9] px-2 py-1 hover:text-[#FDF7FF]">Sign Up</Link>
                        </>
                    )}
                </div>
            </header>
            <main className="bg-[#FBFBFD]">
                <section id="home" className="flex px-12 pt-17 min-h-screen scroll-mt-20 ">
                    <div className="w-1/2 h-auto mt-20">
                        <p className="bg-[#F3F0FE] text-xs text-[#6846DF] w-fit px-4 py-3 rounded-3xl font-bold flex items-center gap-2 mb-5">
                            <Sparkles size={16}/>Stay Organised. Get Hired.
                        </p>
                        <h1 className="font-bold text-4xl leading-tight mb-5">Track your job search,<br/> stay focused ,<span className="text-[#4A00c9]">get hired.</span></h1>
                        <p className="text-[#494456] mt-6 text-xl max-w-xl mb-5">Say goodbye to spreadsheets. DotTracker helps you organise applications ,track progress and manage resume all in one place ,so you can focus on what matters.</p>
                        <div className="mt-8 flex gap-4 mb-5">
                            <Link to="/register" className="p-3 rounded-xl border-2 border-[#9e78fd] text-[#5320D9] text-lg hover:text-[white] hover:bg-[#9e78fd] cursor-pointer">Get Started</Link>
                            <Link to="/dashboard" className="p-3 rounded-xl border-2 border-[#9e78fd] text-[#5320D9] text-lg hover:text-[white] hover:bg-[#9e78fd] cursor-pointer">View Dashboard</Link>
                        </div>
                    </div>
                    <div className="w-1/2 ">
                        <img src="/heroimage.png" alt="Hero image" className=" w-full max-w-2xl h-auto object-cover shadow-2xl rounded-2xl"/>
                    </div>
                </section>
                <section id="features" className="min-h-screen px-12 pt-5 bg-[white] scroll-mt-20">
                    <div className="text-center">
                        <p className="text-[#6846DF] font-bold mt-3">FEATURES</p>
                        <h1 className="text-3xl font-bold mt-3">Everything you need to stay on Track.</h1>
                        <p className="text-gray-500 text-lg mt-2">Powerfull tools designed to simplify your job search and help you move forward with confidence.</p>
                    </div>
                    <div className="grid grid-cols-4 gap-8 mt-16">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDFD] flex items-center justify-center"> 
                                <ClipboardList className="text-[#461ADA]" size={30}/>
                            </div>
                            <h3 className="text-xl font-semibold mt-6">Track Applications</h3>
                            <p className="text-gray-500 mt-4">Keep all your job applications in one place with company name, role, status, date applied, and notes.</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDFD] flex items-center justify-center">
                                <SquareKanban className="text-[#461ADA]" size={30}/>
                            </div>
                            <h3 className="text-xl font-semibold mt-6">Kanban Board</h3>
                            <p className="text-gray-500 mt-4">Visualize your job search pipeline with drag-and-drop columns like Applied, Interview, Offer, and Rejected.</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDFD] flex items-center justify-center">
                                <FileText className="text-[#461ADA]" size={30}/>
                            </div>
                            <h3 className="text-xl font-semibold mt-6">Resume Management</h3>
                            <p className="text-gray-500 mt-4">Attach a different resume to each application and keep tailored versions organized.</p>
                        </div>
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-[#F2EDFD] flex items-center justify-center">
                                <FileSearch className="text-[#461ADA]" size={30}/>
                            </div>
                            <h3 className="text-xl font-semibold mt-6">Application Details</h3>
                            <p className="text-gray-500 mt-4">Store job descriptions, application links, recruiter contacts, and personal notes for every application.</p>
                        </div>
                    </div>
                </section>
                <section id="about" className="px-8 pt-5 bg-[white] scroll-mt-20">
                    <div className="flex mx-12 min-h-screen bg-[#F7F3FD] border-3 border-[#ece5ff] rounded-4xl">
                        <div className="w-1/2 pl-10 pt-10">
                            <p className="text-[#6846DF] font-bold pb-5">About DotTracker</p>
                            <h1 className="font-bold text-3xl pb-5">Built for job seekers, <br/> by job seekers.</h1>
                            <p className="text-[#494456] font-medium pb-5">DotTracker was created to solve a simple problem:<br/>job searching can get messy and overwhelming.</p>
                            <p className="text-[#494456] font-medium pb-5 max-w-xl">We built DotTracker to bring clarity, consistency, and confidence to your journey-so you can stay organized and land the right opportunity.</p>
                            <p className="max-w-lg text-[#494456] font-medium pb-5"><span className="text-[#6846DF] font-bold">Our Mission</span> <br/>To empower job seekers with a simple and beautiful tool that turns chaos into clarity.</p>
                        </div> 
                        <div className="w-1/2">
                            <img src="/herofooter.png" alt="Footer Image" className=" w-full h-auto object-cover rounded-3xl"/>
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <div className="text-center py-5">
                    <h1 className="font-bold text-2xl text-[#4A00C9]">DotTracker</h1>
                    <p className="text-[#494456] font-medium">@2026 DotTracker All rights reserved</p>
                </div>
            </footer>
        </>
    )
}