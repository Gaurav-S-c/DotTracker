import {useState,useEffect,useRef} from "react"
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
import AddJobModal from "./AddJobModal"
import { EllipsisVertical,TriangleAlert} from "lucide-react"

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
    const [menuOpen,setMenuOpen]=useState(false)
    const [showConfirm,setShowConfirm]=useState(false)
    const [deleting,setDeleting]=useState(false)

    const handleDeleteClick=async()=>{
        setDeleting(true)
        await onDelete(job.id)
        setDeleting(false)
        setShowConfirm(false)
    }
    return (
        <>
        <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} style={{...provided.draggableProps.style}}
            className={`mb-1 rounded-2xl border-2 ${col.bColor} bg-white p-2 shadow-sm relative`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold">{job.company}</h4>
                    <p className="text-sm text-[#494456]">{job.role}</p>
                </div>
                <button onClick={(e)=>{e.stopPropagation();setMenuOpen(!menuOpen)}} 
                    className="text-gray-400 hover:text-[#494456] cursor-pointer text-lg leading-none px-1 h-10"
                    >
                    <EllipsisVertical />
                </button>
            </div>
            {menuOpen && (
            <div className="absolute right-2 top-10 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setShowConfirm(true) }}
                className="flex items-center gap-2 px-4 py-2 text-md text-red-500 hover:bg-red-50 w-full text-left cursor-pointer"
                >
                🗑 Delete
                </button>
            </div>
            )}
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

export default function KanbanBoard({ onCountsChange }){
    
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
                const updateJobs=jobs.filter((job)=>job.id.toString()!==job.id.toString())
                updateJobs(updatedJobs)
            }
        }catch(err){
            console.error('failed to delete:',err)
        }
    }

    function handleJobAdded(newJob) {
        const updatedJobs = [...jobs, newJob]
        updateJobs(updatedJobs)  
    }
    
    if (loading) return <p className="text-center mt-8 text-gray-400">Loading your applications...</p>

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <section className="mt-8">
                <div className="overflow-x-auto custom-scrollbar">
                    <div className="flex gap-6 min-w-max pb-4">
                        {columns.map((col)=>{
                            const columnJobs=jobs.filter(
                                (job)=>job.status===col.id
                            )
                            return (
                                <div key={col.id} className={`w-60 ${col.bColor} shrink-0 rounded-2xl border overflow-hidden`}  >
                                    <div className={`${col.bgColor} p-4 flex justify-between items-center`}>
                                        <h3 className="font-bold">{col.label}</h3>
                                        <button className="text-xl cursor-pointer" onClick={()=>{
                                            setSelectedColumn(col.id)
                                            setShowModal(true)
                                        }}>+</button>
                                    </div>
                                    <Droppable droppableId={col.id}>
                                        {(provided)=>(
                                            <div className="p-2 min-h-46 max-h-46 overflow-y-auto" ref={provided.innerRef}{...provided.droppableProps}>
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


