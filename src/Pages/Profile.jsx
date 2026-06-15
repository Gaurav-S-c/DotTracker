import {useState} from 'react'
import { User,Pencil,Star,Headset,Settings,Trash2,TrendingUp,Send,ChevronRight,UserRoundMinus,FileX,Lock,ListMinus } from 'lucide-react'

export default function Profile(){
    return(
        <div>
            <div className='mb-5'>
                <div className='flex items-center'>
                    <h1 className='font-bold text-3xl'>Profile</h1>
                    <ListMinus stroke-black/>
                </div>
                <p className='text-[#494456] text-lg font-medium'>Manage your account information and settings.</p>
            </div>
            <div className='bg-[#F7F3FD] border rounded-2xl h-50 p-4 shadow-lg border-gray-100 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex gap-2'>
                        <div className=' rounded-xl p-2 bg-white'>
                            <User size={18} className='stroke-[#522B95]'/>
                        </div>
                        <h2 className='text-xl font-medium'>Personal Information</h2>
                    </div>
                    <button><Pencil size={25} className='hover:stroke-[#00A63E] cursor-pointer'/></button>
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
                            shadow-lg'>G</div>
                    <div className='grid grid-cols-3 gap-x-10 flex-1'>
                        <div>
                            <p className='tracking-wide text-sm font-semibold text-[#494456]'>FULL NAME</p>
                            <p className='tracking-wide text-xl font-semibold'>Gaurav</p>
                        </div>
                        <div>
                            <p className='tracking-wide text-sm font-semibold text-[#494456]'>EMAIL ADDRESS</p>
                            <p className='tracking-wide text-xl font-semibold'>gaurav@gmail.com</p>
                        </div>
                        <div>
                            <p className='tracking-wide text-sm font-semibold text-[#494456]'>LOCATION</p>
                            <p className='tracking-wide text-xl font-semibold'>India</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-4 gap-8 mb-6'>
                <div className='flex items-center border rounded-2xl p-3 bg-[#F7F3FD] border-gray-100 shadow-lg gap-4'>
                    <div className='p-2 rounded-xl bg-white'>
                        <Send className='stroke-[#522B95]' size={30}/>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-lg font-semibold text-gray-600">Applied</p>
                    </div>
                </div>
                <div className='flex items-center border rounded-2xl p-3 bg-[#F7F3FD] border-gray-100 shadow-lg gap-4'>
                    <div className='p-2 rounded-xl bg-white'>
                        <Headset className='stroke-[#92E3C7]' size={30}/>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-lg font-semibold text-gray-600">Interviews</p>
                    </div>
                </div>
                <div className='flex items-center border rounded-2xl p-3 bg-[#F7F3FD] border-gray-100 shadow-lg gap-4'>
                    <div className='p-2 rounded-xl bg-white'>
                        <Star className='stroke-[#E89516]' size={30}/>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">12</p>
                        <p className="text-lg font-semibold text-gray-600">Offers</p>
                    </div>
                </div>
                <div className='flex items-center border rounded-2xl p-3 bg-[#F7F3FD] border-gray-100 shadow-lg gap-4'>
                    <div className='p-2 rounded-xl bg-white'>
                        <TrendingUp className='stroke-[#A42E79]' size={30}/>
                    </div>
                    <div>
                        <p className="text-3xl font-bold">12%</p>
                        <p className="text-lg font-semibold text-gray-600">Response Rate</p>
                    </div>
                </div>
            </div>
            <div className='rounded-2xl border border-gray-100 shadow-lg bg-[#F7F3FD] h-55 p-4'>
                <div className='flex gap-3 items-center'>
                    <div className=' p-2 rounded-xl bg-white'>
                        <Settings size={20} className='stroke-[#4A00C9]'/>
                    </div>
                    <h2 className='text-xl font-medium'>Account Settings</h2>
                </div>
                <hr className='mt-2 mb-2 border-gray-300'/>
                <div className='flex items-center justify-between bg-white rounded-2xl p-2 hover:bg-green-100 mb-2 cursor-pointer'>
                    <div className='flex gap-3 items-center'>
                        <Lock size={18} className='stroke-[#03b37b]'/>
                        <p className='font-semibold text-[#494456]'>Change Password</p>
                    </div>
                    <ChevronRight/>
                </div>
                <div className='flex items-center justify-between  bg-white rounded-2xl p-2 hover:bg-red-100 mb-2 cursor-pointer'>
                    <div className='flex gap-3 items-center'>
                        <FileX size={18} className='stroke-[#D62438]'/>
                        <p className='font-semibold text-[#494456]'>Delete All Applications</p>
                    </div>
                    <ChevronRight/>
                </div>
                <div className='flex items-center justify-between  bg-white rounded-2xl p-2 hover:bg-red-100 cursor-pointer'>
                    <div className='flex gap-3 items-center'>
                        <UserRoundMinus size={18} className='stroke-[#D62438]'/>
                        <p className='font-semibold text-[#D62438]'>Delete Account</p>
                    </div>
                    <ChevronRight/>
                </div>
            </div>
        </div>
    )
}