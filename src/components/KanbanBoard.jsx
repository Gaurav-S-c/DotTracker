import {useState} from "react"
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

    function handleDragEnd(result){
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
    }

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
                                    <div className={`${col.bgColor} p-4 flex justify-between iterms-center`}>
                                        <h3 className="font-bold">{col.label}</h3>
                                        <button className="text-xl" onClick={()=>{
                                            console.log("clicked")
                                            setSelectedColumn(col.id)
                                            setShowModal(true)
                                            console.log(showModal)
                                        }}>+</button>
                                    </div>
                                    <Droppable droppableId={col.id}>
                                        {(provided)=>(
                                            <div className="p-2 min-h-46" ref={provided.innerRef}{...provided.droppableProps}>
                                                {columnJobs.length===0 ?(
                                                    <>
                                                        <p>No applications yet.</p> 
                                                        <p className="text-xs text-gray-400 text-center px-4">
                                                            {col.id === 'wishlist'  && "Add jobs you're interested in for later."}
                                                            {col.id === 'applied'   && 'Start applying and track your progress here.'}
                                                            {col.id === 'interview' && "Once you get interviews, they'll show up here."}
                                                            {col.id === 'offers'     && 'Your offers will appear here.'}
                                                            {col.id === 'rejected'  && 'Rejections happen. Keep going.'}
                                                        </p>     
                                                    </>
                                                ):(
                                                    columnJobs.map((job,index)=>(
                                                        <Draggable key={job.id} draggableId={job.id.toString()} index={index}>

                                                            {(provided)=>(
                                                                <div ref={provided.innerRef}{...provided.draggableProps}{...provided.dragHandleProps} 
                                                                    className={`mb-1 rounded-2xl border ${col.bColor} bg-white p-2 shadow-sm`}>
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


