import {BookCheck,Headset,Star,StarOff} from 'lucide-react'
import KanbanBoard from '../components/KanbanBoard.jsx'
import AddJobModal from '../components/AddJobModal.jsx'
import {useState,useEffect} from 'react'
import { Link } from "react-router-dom"
import { motion } from 'framer-motion'

function Statcard({Icon,value,label,bgColor,iconColor,bColor,iconBg}){
    return(
        <div className={`flex items-center justify-between border-2 rounded-2xl ${bColor} ${bgColor} p-3`}>
            <div className='flex justify-items-start items-center gap-3'>
                <div className={`p-2 rounded-full w-fit ${iconBg}`}>
                    <Icon className={`size-8 ${iconColor}`}/>
                </div>
                <span className='text-xl font-medium'>{label}</span>
            </div>
            <span className='text-3xl font-semibold'>{value}</span>
        </div>
    )
}

function StatCardSkeleton(){
    return(
        <div className="animate-pulse border-2 border-gray-200 rounded-2xl p-3 h-19">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="w-28 h-5 bg-gray-200 rounded"></div>
                </div>

                <div className="w-10 h-8 bg-gray-200 rounded"></div>
            </div>
        </div>
    )
}

export default function Dashboard(){
    const user=JSON.parse(localStorage.getItem('user'))
    const name=user?.user_metadata?.name || 'User'
    const [loading,setLoading] = useState(true)

    const [counts,setCounts]=useState({
        total:0,
        interviews:0,
        offers:0,
        rejected:0
    })

    const stats=[
        {
        icon:BookCheck,
        value:counts.total,
        label:"Total Applied",
        bgColor:"bg-[#F2EBFD]",
        iconColor:"stroke-[#522B95]",
        iconBg:"bg-[#CBADFC]",
        bColor:"border-[#D7CDE6]"
        },
        {
        icon:Headset,
        value:counts.interviews,
        label:"Interviews",
        bgColor:"bg-[#E2F7F0]",
        iconColor:"stroke-[#031F10]",
        iconBg:"bg-[#92E3C7]",
        bColor:"border-[#C3E1D7]"
        },
        {
        icon:Star,
        value:counts.offers,
        label:"Offers",
        bgColor:"bg-[#FCF5E1]",
        iconColor:"stroke-[#E89516]",
        iconBg:"bg-[#FFDD96]",
        bColor:"border-[#E9E1CA]"
        },
        {
        icon:StarOff,
        value:counts.rejected,
        label:"Rejected",
        bgColor:"bg-[#FFE7E5]",
        iconColor:"stroke-[#D62337]",
        iconBg:"bg-[#FDB6B8]",
        bColor:"border-[#D6BFC0]"
        },
]

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <header className="flex justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Welcome {name}!</h1>
                    <span className="text-lg font-medium text-[#494456]">Here's what's happening with your job search.</span>
                </div>
                <Link to="/dashboard/profile">
                    <div
                        className=" w-18 h-18 rounded-full bg-[#4A00C9] text-white flex items-center justify-center text-4xl font-bold shadow-lg cursor-pointer hover:scale-115 transition-transform "
                        title="Go to Profile"
                    >
                        {name?.[0]?.toUpperCase() || "U"}
                    </div>
                </Link>
            </header>

            <div className='grid grid-cols-4 gap-4'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))
                ):(
                    stats.map((stat)=>{
                        const Icon=stat.icon
                        return(
                            <Statcard key={stat.label}{...stat} Icon={Icon}/>
                        )
                    })
                )}
            </div>
            <main className='mt-8'>
                <KanbanBoard 
                    onCountsChange={setCounts}
                    setDashboardLoading={setLoading}
                />
            </main>
        </motion.div>
    )
}