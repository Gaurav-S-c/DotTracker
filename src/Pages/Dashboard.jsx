import {BookCheck,Headset,Star,StarOff} from 'lucide-react'
import KanbanBoard from '../components/KanbanBoard.jsx'
import AddJobModal from '../components/AddJobModal.jsx'

export default function Dashboard(){
    const stats=[
        {
        icon:BookCheck,
        value:20,
        label:"Total Applied",
        bgColor:"bg-[#F2EBFD]",
        iconColor:"stroke-[#522B95]",
        iconBg:"bg-[#CBADFC]",
        bColor:"border-[#D7CDE6]"
        },
        {
        icon:Headset,
        value:12,
        label:"Interviews",
        bgColor:"bg-[#E2F7F0]",
        iconColor:"stroke-[#031F10]",
        iconBg:"bg-[#92E3C7]",
        bColor:"border-[#C3E1D7]"
        },
        {
        icon:Star,
        value:3,
        label:"Offers",
        bgColor:"bg-[#FCF5E1]",
        iconColor:"stroke-[#E89516]",
        iconBg:"bg-[#FFDD96]",
        bColor:"border-[#E9E1CA]"
        },
        {
        icon:StarOff,
        value:8,
        label:"Rejected",
        bgColor:"bg-[#FFE7E5]",
        iconColor:"stroke-[#D62337]",
        iconBg:"bg-[#FDB6B8]",
        bColor:"border-[#D6BFC0]"
        },
]

const user=JSON.parse(localStorage.getItem('user'))
const name=user?.user_metadata?.name || 'User'


function Statcard({Icon,value,label,bgColor,iconColor,bColor,iconBg}){
    return(
        <div className={`border-2 rounded-2xl ${bColor} ${bgColor} p-5`}>
            <div className={`p-2 rounded-full w-fit ${iconBg}`}>
                <Icon className={`size-8 ${iconColor}`}/>
            </div>
            <p className='text-4xl font-bold'>{value}</p>
            <p className='text-xl font-medium'>{label}</p>
        </div>
    )
}

    return(
        <>
            <header className="flex justify-between mb-8">
                <div>
                    <h1 className="text-5xl font-bold pb-2">Welcome {name}!</h1>
                    <span className="text-xl font-medium">Here's what's happening with your job search.</span>
                </div>
                <img src="/profile.png" alt="profile placeholder."  className="size-25"/>
            </header>

            <div className='grid grid-cols-4 gap-6'>
                {stats.map((stat)=>{
                    const Icon=stat.icon
                    return(
                        <Statcard key={stat.label}{...stat} Icon={Icon}/>
                    )
                })}
            </div>
            <main className='mt-8'>
                <KanbanBoard />
            </main>
        </>
    )
}