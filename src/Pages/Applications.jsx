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
                const response=await fetch('http://localhost:3000/api/dashboard',{
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

    if(loading)return (
        <p className="text-center mt-8">Loading Applications...</p>
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