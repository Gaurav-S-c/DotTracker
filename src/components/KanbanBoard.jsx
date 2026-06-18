import {useState,useEffect,useRef} from "react"
import {useNavigate} from 'react-router-dom'
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
import AddJobModal from "./AddJobModal"
import { EllipsisVertical,TriangleAlert,Trash2,Pencil} from "lucide-react"

const columns=[
    {
        id:"wishlist",
        label:"Wishlist",
        bColor:"border-[#75A0AD]",
        bgColor:"bg-[#C0E4FC]"
    },
    {
        id:"applied",
        label:"Applied",
        bColor:"border-[#9682AA]",
        bgColor:"bg-[#DCC9FF]"
    },
    {
        id:"interview",
        label:"Interview",
        bColor:"border-[#8EC7B4]",
        bgColor:"bg-[#B3EDD7]"
    },
    {
        id:"offers",
        label:"Offers",
        bColor:"border-[#E4911F]",
        bgColor:"bg-[#FFB001]"
    },
    {
        id:"rejected",
        label:"Rejected",
        bColor:"border-[#C80F23]",
        bgColor:"bg-[#FDB6B4]"
    }
]

function calculateCounts(jobsList){
    return{
        total:jobsList.length,
        interviews:jobsList.filter(j => j.status === 'interview').length,
        offers:jobsList.filter(j => j.status === 'offers').length,
        rejected:jobsList.filter(j => j.status === 'rejected').length
    }
}

function JobCard({job,provided,col,onDelete}){
    const [showEdit, setShowEdit]= useState(false)
    const [showConfirm,setShowConfirm]=useState(false)
    const [deleting,setDeleting]=useState(false)
    const navigate=useNavigate()

    const handleDeleteClick=async()=>{
        setDeleting(true)
        await onDelete(job.id)
        setDeleting(false)
        setShowConfirm(false)
    }
    return (
        <>
        <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} style={{...provided.draggableProps.style}}
            className={`mb-2 rounded-xl border-2 ${col.bColor} bg-white p-2 shadow-sm relative`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-md ">{job.company}</h4>
                <div className="flex items-center gap-1 mt-1 shrink-0">
                    <button
                        onClick={(e) => { 
                            e.stopPropagation()
                            navigate(`/dashboard/applications/${job.id}?edit=true`)
                         }}
                        className="text-gray-400 hover:text-green-500 cursor-pointer transition-colors"
                    >
                        <Pencil size={17}/>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowConfirm(true) }}
                        className="text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    >
                        <Trash2 size={17}/>
                    </button>
                </div>
            </div>
            <p className="text-xs text-[#494456]">{job.role}</p>
            <div className={`border-t border-dashed ${col.bColor} my-2`}/>
            <div className="flex items-center justify-between">
                {job.job_type && (
                    <span
                    style={{ backgroundColor: col.bgColor?.replace('bg-[', '').replace(']', '') }}
                    className={`text-xs font-medium px-2 py-1 rounded-full ${col.bgColor}`}
                    >
                    {job.job_type}
                    </span>
                )}
                {job.Applied_date && (
                    <span className="text-sm text-gray-400">
                    {new Date(job.Applied_date).toLocaleDateString('en-IN', {
                        day:   'numeric',
                        month: 'short'
                    })}
                    </span>
                )}
            </div>
        </div>

        {showConfirm && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"><TriangleAlert size={30} color="#FFAB03"/></span>
                </div>
                <h3 className="text-xl font-bold text-center mb-2">Delete Application?</h3>
                <p className="text-center text-gray-500 text-sm mb-6">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-gray-800">{job.company}</span>?
                This action cannot be undone.
                </p>
                <div className="flex gap-3">
                <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDeleteClick}
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

export default function KanbanBoard({ onCountsChange ,setDashboardLoading }){
    
    const [jobs,setjobs]=useState([])
    const [showModal,setShowModal]=useState(false)
    const [selectedColumn,setSelectedColumn]=useState(null)
    const [loading,setLoading]=useState(true)

     function updateJobs(newJobs) {
        setjobs(newJobs)
        if (onCountsChange) onCountsChange(calculateCounts(newJobs))
    }

    useEffect(()=>{
        async function fetchJobs(){
            try{
                const token=localStorage.getItem('token')
                const response=await fetch('http://localhost:3000/api/dashboard',{
                    headers:{'Authorization':`Bearer ${token}`}
                })
                const data=await response.json()
                if(response.ok){
                    updateJobs(data)
                }
            }
            catch(err){
                console.error('Failed to fetch jobs:', err)
            }finally {
                setLoading(false)
                if(setDashboardLoading){
                    setDashboardLoading(false)
                }
            }
        }
        fetchJobs()
    },[])

    async function handleDragEnd(result){
        if(!result.destination) return 
        const jobId=result.draggableId
        const newStatus=result.destination.droppableId

        const updatedJobs = jobs.map((job) =>
        job.id.toString() === jobId ? { ...job, status: newStatus } : job
        )
        updateJobs(updatedJobs)

        try{
            const token=localStorage.getItem('token')
            await fetch(`http://localhost:3000/api/dashboard/${jobId}`,{
                method:'PATCH',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({status:newStatus})
            })
        }catch(err){
            console.error('Failed to update status:', err)
        }
    }

    async function handleDelete(jobId){
        try{
            const token=localStorage.getItem('token')
            const response=await fetch(`http://localhost:3000/api/dashboard/${jobId}`,{
                method:'DELETE',
                headers:{'Authorization':`Bearer ${token}`}
            })
            if(response.ok){
                const updatedJobs=jobs.filter((job)=>job.id.toString()!==jobId.toString())
                updateJobs(updatedJobs)
            }else {
                console.error('Delete failed')
            }
        }catch(err){
            console.error('failed to delete:',err)
        }
    }

    function handleJobAdded(newJob) {
        const updatedJobs = [...jobs, newJob]
        updateJobs(updatedJobs)  
    }
    
    if (loading) return(
        <section className="mt-8">
            <div className="flex gap-4 min-w-max">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        className="w-56 h-96 rounded-2xl bg-gray-100 animate-pulse"
                    />
                ))}
            </div>
        </section>
    )

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <section className="mt-8">
                    <div className="flex gap-4 min-w-max pb-5">
                        {columns.map((col)=>{
                            const columnJobs=jobs.filter(
                                (job)=>job.status===col.id
                            )
                            return (
                                <div key={col.id} className={`w-56 ${col.bColor} shrink-0 rounded-2xl border-2 border-dashed overflow-hidden`}  >
                                    <div className={`${col.bgColor} p-4 flex justify-between items-center`}>
                                        <h3 className="font-bold">{col.label}</h3>
                                        <button className="text-xl cursor-pointer" onClick={()=>{
                                            setSelectedColumn(col.id)
                                            setShowModal(true)
                                        }}>+</button>
                                    </div>
                                    <Droppable droppableId={col.id}>
                                        {(provided)=>(
                                            <div className="p-2 h-87 overflow-y-auto" ref={provided.innerRef}{...provided.droppableProps}>
                                                {columnJobs.length===0 ?(
                                                    <div className="text-center">
                                                        <p>No applications yet.</p> 
                                                        <p className="text-xs text-gray-400 text-center px-4">
                                                            {col.id === 'wishlist'  && "Add jobs you're interested in for later."}
                                                            {col.id === 'applied'   && 'Start applying and track your progress here.'}
                                                            {col.id === 'interview' && "Once you get interviews, they'll show up here."}
                                                            {col.id === 'offers'     && 'Your offers will appear here.'}
                                                            {col.id === 'rejected'  && 'Rejections happen. Keep going.'}
                                                        </p>     
                                                    </div>
                                                ):(
                                                    columnJobs.map((job,index)=>(
                                                        <Draggable key={job.id} draggableId={job.id.toString()} index={index}>

                                                            {(provided)=>(
                                                                <JobCard 
                                                                    job={job}
                                                                    provided={provided}
                                                                    col={col}
                                                                    onDelete={handleDelete}
                                                                />
                                                            )}
                                                        </Draggable>
                                                    ))
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            )
                        })}
                    </div>
                <AddJobModal 
                    showModal={showModal}
                    setShowModal={setShowModal}
                    selectedColumn={selectedColumn}
                    setjobs={setjobs}
                    onJobAdded={handleJobAdded}
                />
            </section>
        </DragDropContext>
    )
}


