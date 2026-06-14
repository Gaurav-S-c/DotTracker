import {Search,ChevronDown,Sparkles,Plus} from 'lucide-react'
import {useState} from 'react'

const STATUSES=['all','wishlist','applied','interview','offers','rejected']

export default function ApplicationHeader({search,onSearch,statusFilter,onFilter,onAddNew}){
    const [showFilter,setShowFilter]=useState(false)

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <div className='flex gap-2 items-center'>
                    <h1 className='text-3xl font-bold'>Applications</h1>
                    <Sparkles size={30}/>
                </div>
                <button 
                    onClick={onAddNew}
                    className='flex items-center gap-2 px-3 py-2 bg-[#4A00C9] text-white text-sm font-medium rounded-xl hover:opacity-80 cursor-pointer transition-opacity'
                >
                    <Plus/>
                    <span>Add New Application</span>
                </button>
            </div>
            <hr className='border-t-2 border-[#c5a6fb]'/>
            <div className='flex gap-3 mt-4'>
                <div className='relative flex-1'>
                    <Search size={20} className='absolute left-3 top-5 -translate-y-2.5 text-gray-400'/>
                    <input
                        type='text'
                        placeholder="Search applications..."
                        value={search}
                        onChange={e=>onSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-400 rounded-xl text-sm focus:outline-none focus:border-[#c5a6fb] bg-white"
                    />
                </div>
                <div className='relative'>
                    <button onClick={()=>setShowFilter(!showFilter)} className='flex items-center justify-between gap-2 px-4 py-2.5 border-2 border-gray-400 rounded-xl text-sm text-gray-600 bg-white hover:border-[#c5a6fb] cursor-pointer min-w-46'>
                        <span>{statusFilter === 'all' ? "All Statuses": statusFilter}</span>
                        <ChevronDown size={20}/>
                    </button>

                    {showFilter && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowFilter(false)}/>
                            <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden w-40">
                                {STATUSES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { onFilter(s); setShowFilter(false) }}
                                    className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-purple-50 hover:text-[#4A00C9] cursor-pointer ${
                                    statusFilter === s
                                        ? 'bg-purple-50 text-[#4A00C9] font-medium'
                                        : 'text-gray-600'
                                    }`}
                                >
                                    {s === 'all' ? 'All Statuses' : s}
                                </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}