import {useState,useEffect} from "react"
import {DragDropContext,Droppable,Draggable} from "@hello-pangea/dnd"
import AddJobModal from "./AddJobModal"

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

export default function KanbanBoard(){
    
    const [jobs,setjobs]=useState([])
    const [showModal,setShowModal]=useState(false)
    const [selectedColumn,setSelectedColumn]=useState(null)
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        async function fetchJobs(){
            try{
                const token=localStorage.getItem('token')
                const response=await fetch('http://localhost:3000/api/dashboard',{
                    headers:{'Authorization':`Bearer ${token}`}
                })
                const data=await response.json()
                if(response.ok){
                    setjobs(data)
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

        setjobs((prev)=>
            prev.map((job)=>
                job.id.toString()===jobId ?{
                    ...job,
                    status:newStatus,
                } :
                job   
            ))

        try{
            const token=localStorage.getItem('token')
            await fetch(`http://localhost:3000/api/dashboard/${jobId}`,{
                method:'PATCH',
                header:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ${token}'
                },
                body:JSON.stringify({status:newStatus})
            })
        }catch(err){
            console.error('Failed to update status:', err)
        }
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
                                            <div className="p-2 min-h-46" ref={provided.innerRef}{...provided.droppableProps}>
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
                                                                <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} 
                                                                    className={`mb-1 rounded-2xl border-2 ${col.bColor} bg-white p-2 shadow-sm`}>
                                                                    <h4 className="font-semibold">{job.company}</h4>
                                                                    <p className="text-sm text-gray-500">{job.role}</p>
                                                                </div>
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
                />
            </section>
        </DragDropContext>
    )
}


