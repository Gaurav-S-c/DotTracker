import { NavLink,Link } from 'react-router-dom'
import {Goal,House,UserPen,FileUser} from 'lucide-react'

export default function Sidebar() {

  return (
    <header className='w-52 h-screen pt-8 p-4 border-r border-[#c5a6fb] flex flex-col items-center bg-[url("/sidebar-bg.png")] bg-cover bg-center bg-no-repeat'>
      <Link to='/' className='flex items-center gap-2 pb-10 hover:text-[#4A00C9]'>
        <Goal className='size-10 stroke-[#6a2fea]'/>
        <span className='font-bold text-2xl'>DotTracker</span>
      </Link>
      <nav className='w-40'>
        <NavLink to="/dashboard" end className='flex items-center gap-3 pb-5 font-bold hover:text-[#ed5885]'>
          <div className='p-1 rounded-sm bg-[#FFE7E5]'>
            <House className='size-5 stroke-[#D62438] '/>
          </div>
          DashBoard
        </NavLink>
        <NavLink to="/dashboard/applications" className='flex items-center gap-3 pb-5 font-bold hover:text-[#6bd7b7]'>
          <div className='p-1 rounded-sm bg-[#E3F6F0]'>
            <UserPen className='size-5 stroke-[#96E5CC]'/>
          </div>
          Applications
        </NavLink>
        <NavLink to="/dashboard/profile" className='flex items-center gap-3 pb-5 font-bold hover:text-[#ffb909]'>
          <div className='p-1 rounded-sm bg-[#FDF4E1]'>
            <FileUser className='size-5 stroke-[#FFAB03]'/>
          </div>
          Profile
        </NavLink>
      </nav>
    </header>
  )
}