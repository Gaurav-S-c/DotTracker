import {useEffect, useState} from 'react'
import { User,Pencil,Star,Headset,Settings,Trash2,TrendingUp,Send,ChevronRight,UserRoundMinus,FileX,Lock,ListMinus,Check,X } from 'lucide-react'

import ChangePasswordModal from '../components/ProfileModals/ChangePasswordModal'
import DeleteAccModal from '../components/ProfileModals/DeleteAccModal'
import DeleteAppsModal from '../components/ProfileModals/DeleteAppsModal'

export default function Profile(){
    const storedUser=JSON.parse(localStorage.getItem('user'))
    const [name,setName]=useState(storedUser?.user_metadata?.name || '')
    const [editingName,setEditingName]=useState(false)
    const [tempName,setTempName]=useState(name)
    const [savingName,setSavingName]=useState(false)
    const [stats, setStats]= useState({ total: 0, interviews: 0, offers: 0, rate: 0 })

    const [showChangePassword, setShowChangePassword]= useState(false)
    const [showDeleteApps, setShowDeleteApps]= useState(false)
    const [showDeleteAccount, setShowDeleteAccount]= useState(false)

    useEffect(()=>{
        async function fetchStats(){
            try{
                const token=localStorage.getItem('token')
                const response=await fetch('http://localhost:3000/api/dashboard',{
                    headers:{'Authorization':`Bearer ${token}`}
                })
                const data=await response.json()
                if(response.ok){
                    const total=data.length
                    const interviews=data.filter(j=>j.status==='interview').length
                    const offers=data.filter(j=>j.status==='offers').length
                    const rate=total>0 ? Math.round((interviews/total)*100):0
                    setStates({total,interviews,offers,rate})
                }
            }catch(err){
                console.error('Failed to fetch stats:',err)
            }
        }
        fetchStats()
    },[])

    async function handleSaveName(){
        if(!tempName.trim())return
        setSavingName(true)
        try{    
            const token =localStorage.getItem('token')
            const respone=await fetch('http://localhost:3000/api/auth/update-name',{
                method:'PATCH',
                headers:{
                    'content-type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({name:tempName})
            })
            if(response.ok){
                setName(tempName)
                const user =JSON.parse(localStorage.getItem('user'))
                user.user_metadata.name=tempName
                localStorage.setItem('user',JSON.stringify(user))
                setEditingName(false)
            }

        }catch(err){
            console.error('Failed to update Name:',err)
        }finally{
            setSavingName(false)
        }
    }

    return(
        <div>
            <div className='mb-5'>
                <div className='flex items-center'>
                    <h1 className='font-bold text-3xl'>Profile</h1>
                    <ListMinus className='stroke-black'/>
                </div>
                <p className='text-[#494456] text-lg font-medium'>Manage your account information and settings.</p>
            </div>
            <div className='bg-[#F7F3FD] border rounded-2xl h-50 p-4 shadow-lg border-gray-100 mb-6'>
                <div className='flex gap-2'>
                    <div className=' rounded-xl p-2 bg-white'>
                        <User size={18} className='stroke-[#522B95]'/>
                    </div>
                    <h2 className='text-xl font-medium'>Personal Information</h2>
                </div>
                <hr className='mb-3 mt-3 border-gray-300'/>
                <div className='flex items-center gap-18'>
                    <div className='w-25
                            h-25
                            rounded-full
                            bg-[#4A00C9]
                            text-white
                            flex
                            items-center
                            justify-center
                            text-6xl
                            font-semibold
                            shadow-lg'>{name?.[0]?.toUpperCase() || 'U'}</div>
                    <div className='grid grid-cols-3 gap-x-10 flex-1'>
                        <div>
                            <div className='flex items-center justify-between mb-2 px-2'>
                                <p className='tracking-wide text-sm font-semibold text-[#494456]'>FULL NAME</p>
                                {editingName? (
                                    <div className='flex gap-2'>
                                        <button onClick={handleSaveName} disabled={savingName} className='cursor-pointer'>
                                            <Check size={16} className='hover:stroke-[#00A63E]'/>
                                        </button>
                                        <button onClick={() => { setEditingName(false); setTempName(name) }}>
                                            <X size={16} className='hover:stroke-red-500 cursor-pointer'/>
                                        </button>
                                    </div>
                                ):(
                                    <button onClick={() => { setEditingName(true); setTempName(name) }}>
                                        <Pencil size={18} className='hover:stroke-[#0024a6] cursor-pointer'/>
                                    </button>
                                )}
                            </div>
                            {editingName?(
                                <input
                                    value={tempName}
                                    onChange={e=>setTempName(e.target.Value)}
                                    onKeyDown={e=>e.key==='Enter' && handleSaveName()}
                                    autoFocus
                                    className='tracking-wide text-lg font-semibold rounded-2xl bg-white shadow-lg pl-2 py-1 w-full border border-[#c5a6fb] focus:outline-none focus:border-[#4A00C9]'
                                />
                            ):(
                                <p className='tracking-wide text-xl font-semibold rounded-2xl bg-white shadow-lg pl-2 py-1'>
                                    {name || '—'}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className='tracking-wide text-sm font-semibold text-[#494456] mb-2 pl-2'>EMAIL ADDRESS</p>
                            <p className='tracking-wide text-md font-semibold text-[#4b4852] rounded-2xl bg-white shadow-lg pl-2 py-1.5 overflow-hidden'>
                                {storedUser?.email || '—'}
                            </p>
                        </div>
                        <div>
                            <p className='tracking-wide text-sm font-semibold text-[#494456] mb-2 pl-2'>LOCATION</p>
                            <p className='tracking-wide text-xl font-semibold rounded-2xl text-[#4b4852] bg-white shadow-lg pl-2 py-1'>India</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-4 gap-8 mb-6'>
                {[
                    { icon: <Send className='stroke-[#522B95]' size={30}/>,value: stats.total,label:'Applied'},
                    { icon: <Headset className='stroke-[#92E3C7]' size={30}/>,value: stats.interviews,label:'Interviews'},
                    { icon: <Star className='stroke-[#E89516]' size={30}/>,value: stats.offers,label: 'Offers'},
                    { icon: <TrendingUp className='stroke-[#A42E79]' size={30}/>,value: `${stats.rate}%`,label:'Response Rate'},
                ].map(s=>(
                    <div key={s.label} className='flex items-center border rounded-2xl p-3 bg-[#F7F3FD] border-gray-100 shadow-lg gap-4'>
                        <div className='p-2 rounded-xl bg-white'>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-3xl font-bold">{s.value}</p>
                            <p className="text-lg font-semibold text-gray-600">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className='rounded-2xl border border-gray-100 shadow-lg bg-[#F7F3FD] h-55 p-4'>
                <div className='flex gap-3 items-center'>
                    <div className=' p-2 rounded-xl bg-white'>
                        <Settings size={20} className='stroke-[#4A00C9]'/>
                    </div>
                    <h2 className='text-xl font-medium'>Account Settings</h2>
                </div>
                <hr className='mt-2 mb-2 border-gray-300'/>

                <div className='flex items-center justify-between bg-white rounded-2xl p-2 hover:bg-green-100 mb-2 cursor-pointer shadow-lg'
                    onClick={()=>setShowChangePassword(true)}
                >
                    <div className='flex gap-3 items-center'>
                        <Lock size={18} className='stroke-[#03b37b]'/>
                        <p className='font-semibold text-[#494456]'>Change Password</p>
                    </div>
                    <ChevronRight/>
                </div>
                <div className='flex items-center justify-between  bg-white rounded-2xl p-2 hover:bg-red-100 mb-2 cursor-pointer shadow-lg'
                    onClick={()=>setShowDeleteApps(true)}
                >
                    <div className='flex gap-3 items-center'>
                        <FileX size={18} className='stroke-[#D62438]'/>
                        <p className='font-semibold text-[#494456]'>Delete All Applications</p>
                    </div>
                    <ChevronRight/>
                </div>
                <div className='flex items-center justify-between  bg-white rounded-2xl p-2 hover:bg-red-100 cursor-pointer shadow-lg'
                    onClick={()=>setShowDeleteAccount(true)}
                >
                    <div className='flex gap-3 items-center'>
                        <UserRoundMinus size={18} className='stroke-[#D62438]'/>
                        <p className='font-semibold text-[#D62438]'>Delete Account</p>
                    </div>
                    <ChevronRight/>
                </div>
            </div>

            {showChangePassword && (
                <ChangePasswordModal onClose={()=>setShowChangePassword(false)}/>
            )}
            {showDeleteApps && (
                <DeleteAppsModal
                    onClose={() => setShowDeleteApps(false)}
                    onSuccess={() => setStats({ ...stats, total: 0, interviews: 0, offers: 0, rate: 0 })}
                />
            )}
            {showDeleteAccount && (
                <DeleteAccModal onClose={() => setShowDeleteAccount(false)} />
            )}
        </div>
    )
}