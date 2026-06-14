import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Trash2,Pencil,ChevronRight,ChevronLeft,TriangleAlert } from "lucide-react"

const STATUS_STYLES = {
  wishlist:  'border border-purple-400 text-purple-600',
  applied:   'border border-yellow-400 text-yellow-600',
  interview: 'border border-green-400  text-green-600',
  offers:    'border border-teal-400   text-teal-600',
  rejected:  'border border-red-400    text-red-500',
}

const AVATAR_COLORS = [
  { bg: '#EDE9FE', text: '#6D28D9' },
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#FCE7F3', text: '#BE185D' },
  { bg: '#E0F2FE', text: '#0369A1' },
  { bg: '#FFE4E6', text: '#BE123C' },
]

function getAvatarColor(name){
    const index=(name?.charCodeAt(0)||0)%AVATAR_COLORS.length
    return AVATAR_COLORS[index]
}

export default function ApplicationTable({jobs,onDelete,currentPage,setCurrentPage,rowsPerPage}){   

    const navigate=useNavigate()
    const [showConfirm,setShowConfirm]=useState(false)
    const [selectedJob,setSelectedJob]=useState(null)
    const [deleting,setDeleting]=useState(false)

    const totalPages=Math.ceil(jobs.length/rowsPerPage)
    const startIndex=(currentPage-1)*rowsPerPage
    const currentJobs=jobs.slice(startIndex,startIndex+rowsPerPage)

    async function handleDelete(jobId){
        setDeleting(true)
        try{
            const token=localStorage.getItem('token')
            const response=await fetch(`http://localhost:3000/api/dashboard/${jobId}`,{
                method:'DELETE',
                headers:{'Authorization':`Bearer ${token}`}
            })
            if(response.ok){
                onDelete(jobId)
                setShowConfirm(false)
                setSelectedJob(null)
                if(currentJobs.length===1 && currentPage>1){
                    setCurrentPage(p=>p-1)
                }
            }
        }catch(err){
            console.error('Failed to delete:',err)
        }finally{
            setDeleting(false)
        }
    }

    return (
        <>
            <div className=" rounded-2xl border border-gray-400 shadow-sm overflow-hidden mt-5">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-500 bg-[#F7F3FD]">
                            <th className="text-left px-5 py-3 font-bold text-base">Company</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Role</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Status</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Date Applied</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Job Type</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Notes</th>
                            <th className="text-left px-5 py-3 font-bold text-base">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentJobs.length===0 ?(
                            <tr>
                                <td colSpan={6} className="text-center py-16 text-gray-400">
                                    No Applications Found.
                                </td>
                            </tr>
                        ):(
                            currentJobs.map(job=>{
                                const avatar=getAvatarColor(job.company)
                                return(
                                    <tr key={job.id} onClick={()=>navigate(`/dashboard/applications/${job.id}`)}
                                    className="border-b border-gray-400 hover:bg-[#fdf7ff] transition-colors cursor-pointer"
                                    >
                                        <td className="px-5 py-3">        
                                            <span className="font-semibold text-gray-900 text-base">{job.company.toUpperCase()}</span>
                                        </td>

                                        <td className="px-5 py-3 text-[#494456]">{job.role}</td>

                                        <td className="px-5 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                            STATUS_STYLES[job.status] || 'border border-gray-300 text-[#494456]'
                                            }`}>
                                                {job.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3 text-[#494456]">
                                            {job.Applied_date
                                            ? new Date(job.Applied_date).toLocaleDateString('en-IN',{
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })
                                            :'--'}
                                        </td>

                                        <td className="px-5 py-3 text-[#494456]">
                                            {job.job_type}
                                        </td>

                                        <td className="px-5 py-3 text-[#494456] max-w-xs truncate">
                                            {job.Notes || '—'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    navigate(`/dashboard/applications/${job.id}?edit=true`)
                                                }}
                                                className="p-1.5 rounded-lg border border-green-300 text-green-400 hover:text-green-600 hover:bg-green-100 cursor-pointer transition-colors"
                                                >
                                                <Pencil size={15}/>
                                                </button>
                                                <button
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    setSelectedJob(job)
                                                    setShowConfirm(true)
                                                }}
                                                className="p-1.5 rounded-lg border border-red-300 text-red-400 hover:text-red-600 hover:bg-red-100 cursor-pointer transition-colors"
                                                >
                                                <Trash2 size={15}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-600">
                        Showing {jobs.length===0 ? 0 : startIndex+1} to {' '}
                        {Math.min(startIndex + rowsPerPage, jobs.length)} of {jobs.length} results
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-gray-500 text-gray-900 hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
                        >
                        <ChevronLeft size={17}/>
                        </button>
                        {Array.from({length:totalPages},(_,i)=>i+1).map(page=>(
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-7 h-7 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                                currentPage === page
                                    ? 'bg-[#4A00C9] text-white'
                                    : 'border border-gray-300 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {page}
                        </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-1.5 rounded-lg border border-gray-500 text-gray-900 hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
                            >
                            <ChevronRight size={17}/>
                        </button>
                    </div>
                </div>
            </div>
            {showConfirm && selectedJob && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl"><TriangleAlert size={30} color="#FFAB03"/></span>
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Application?</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-gray-800">{selectedJob.company}</span>?
                        This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                        <button
                            onClick={() => {setShowConfirm(false);setSelectedJob(null)}}
                            className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={()=>handleDelete(selectedJob.id)}
                            disabled={deleting}
                            className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                        >
                            {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}