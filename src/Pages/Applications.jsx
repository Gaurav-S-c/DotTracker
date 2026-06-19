import ApplicationHeader from "../components/Applications/ApplicationHeader"
import ApplicationTable from "../components/Applications/ApplicationTable"
import AddJobModal from "../components/AddJobModal"
import {useState,useEffect} from 'react'
import { motion } from "framer-motion"

const ROWS_PER_PAGE=7

export default function Applications(){
    const [jobs,setJobs]=useState([])
    const [loading,setLoading]=useState(true)
    const [search,setSearch]=useState('')
    const [statusFilter,setStatusFilter]=useState('all')
    const [currentPage,setCurrentPage]=useState(1)
    const [showModal, setShowModal]   = useState(false)
    const [selectedColumn, setSelectedColumn] = useState(null)

    useEffect(()=>{
        async function fetchJobs(){
            try{
                const token=localStorage.getItem('token')
                const response=await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`,{
                    headers:{'Authorization':`Bearer ${token}`}
                })
                const data = await response.json()
                if(response.ok)setJobs(data)
                console.log("fetched Data:",data)
                console.log("job state:",jobs)
            }
            catch(err){
                console.error('Failed to fetch:',err)
            }
            finally{
                setLoading(false)
            }
        }
        fetchJobs()
    },[])

    const handleJobAdded=(newJob)=>{
        setJobs(prev=>[newJob,...prev])
    }

    const filtered=jobs.filter(job=>{
        const matchSearch=(
            job.company?.toLowerCase().includes(search.toLowerCase())||
            job.role?.toLowerCase().includes(search.toLowerCase())||
            job.job_type?.toLowerCase().includes(search.toLowerCase())
        )
        const matchStatus=statusFilter==='all'|| job.status===statusFilter
        return matchSearch && matchStatus
    })

    const handleSearch=(val)=>{setSearch(val);setCurrentPage(1)}
    const handleFilter=(val)=>{setStatusFilter(val);setCurrentPage(1)}

    const handleDelete=(jobId)=>{
        setJobs(prev=>prev.filter(j=>j.id.toString()!==jobId.toString()))
    }

    function ApplicationTableSkeleton() {
        return (
            <div className="rounded-2xl border border-gray-400 shadow-sm overflow-hidden mt-5 animate-pulse">
                <div className="bg-[#F7F3FD] border-b border-gray-300 h-12"></div>

                {Array.from({ length: 7 }).map((_, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-8 gap-4 px-5 py-4 border-b border-gray-200"
                    >
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="flex gap-2">
                            <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                            <div className="w-7 h-7 bg-gray-200 rounded-lg"></div>
                        </div>
                    </div>
                ))}

                <div className="h-12 bg-gray-50"></div>
            </div>
        )
    }

    if(loading)return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
            <ApplicationHeader
                search=""
                onSearch={() => {}}
                statusFilter="all"
                onFilter={() => {}}
                onAddNew={() => {}}
            />

            <ApplicationTableSkeleton />
        </motion.div>
    )

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
        <div>
            <ApplicationHeader
                search={search}
                onSearch={handleSearch}
                statusFilter={statusFilter}
                onFilter={handleFilter}
                onAddNew={()=>{
                    setSelectedColumn(null)
                    setShowModal(true)
                }}
            />
            <ApplicationTable
                jobs={filtered}
                onDelete={handleDelete}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={ROWS_PER_PAGE}
            />
            <AddJobModal
                showModal={showModal}
                setShowModal={setShowModal}
                selectedColumn={selectedColumn}
                setjobs={setJobs}
                onJobAdded={handleJobAdded}
            />
        </div>
        </motion.div>
    )
}