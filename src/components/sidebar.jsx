import { NavLink,Link,useNavigate } from 'react-router-dom'
import {Goal,House,Boxes,FileUser,LogOut,Wand2} from 'lucide-react'

export default function Sidebar() {
  const navigate=useNavigate()

  const handleLogout=async()=>{
    try{
        const token =localStorage.getItem('token')

        await fetch('http://localhost:3000/api/auth/logout',{
          method:'POST',
          headers:{
            'Authorization':`Bearer ${token}`
          }
        })
    }
    catch(err){
        console.error('Logout error:', err)
    }finally{
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  return (
    <header className='w-45 h-screen pt-10 p-4 border-r border-[#c5a6fb] flex flex-col items-center bg-[url("/sidebar-bg.png")] bg-cover bg-center bg-no-repeat'>
      <Link to='/' className='flex items-center gap-2 pb-8 hover:text-[#4A00C9]'>
        <Goal className='size-9 stroke-[#6a2fea]'/>
        <span className='font-bold text-2xl'>DotTracker</span>
      </Link>
      <nav className='w-40'>
        <NavLink to="/dashboard" end className='flex items-center gap-3 pb-5 font-medium hover:text-[#ed5885]'>
          <div className='p-1 rounded-sm bg-[#FFE7E5]'>
            <House className='size-5 stroke-[#D62438] '/>
          </div>
          DashBoard
        </NavLink>
        <NavLink to="/dashboard/applications" className='flex items-center gap-3 pb-5 font-medium hover:text-[#6bd7b7]'>
          <div className='p-1 rounded-sm bg-[#E3F6F0]'>
            <Boxes className='size-5 stroke-[#96E5CC]'/>
          </div>
          Applications
        </NavLink>
        <NavLink to="/dashboard/profile" className='flex items-center gap-3 pb-5 font-medium hover:text-[#ffb909]'>
          <div className='p-1 rounded-sm bg-[#FDF4E1]'>
            <FileUser className='size-5 stroke-[#FFAB03]'/>
          </div>
          Profile
        </NavLink>
        <NavLink to="/dashboard/resume-tailor" className='flex items-center gap-3 pb-5 font-medium hover:text-[#65c1ff]'>
          <div className='p-1 rounded-sm bg-[#e7f5fe]'>
            <Wand2 className='size-5 stroke-[#65c1ff]'/>
          </div>
          Resume Tailor
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="flex items-center gap-3 font-semibold cursor-pointer w-35 mt-auto border-3 border-red-600 rounded-xl px-3 py-2 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 hover:bg-transition-colors">
        <LogOut className='size-5'/>
        Logout
      </button>
    </header>
  )
}