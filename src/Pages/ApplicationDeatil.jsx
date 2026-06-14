import { useState,useEffect } from "react"
import { useParams,useNavigate,useSearchParams } from "react-router-dom"
import { ArrowLeft,Pencil,Trash2,TriangleAlert,Check,X } from "lucide-react"

const STATUS_STYLES={
    wishlist:'border border-[#75A0AD] bg-[#C0E4FC]',
    applied:'border border-[#9682AA] bg-[#F2EBFD]',
    interview:'border border-[#8EC7B4] bg-[#BFEECB]',
    offers:'border border-[#E4911F] bg-[#FFDD96]',
    rejected:'border border-[#C80F23] bg-[#FDCDCD]',
}

function EditableField({label,value,name,onChange,type='text',options,placeholder}){
    return(
        <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {label}
            </p>
            {options ? (
                <select name={name} value={value} onChange={onChange}
                    className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9] bg-white"
                >
                    {options.map(opt=>(
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            ):(
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                />
            )}
        </div>
    )
}

export default function ApplicationDetail(){
    const {id}=useParams()
    const navigate=useNavigate()
    const [searchParams]=useSearchParams()
    const isEditMode=searchParams.get('edit')==='true'

    const [job, setJob]               = useState(null)
    const [loading, setLoading]       = useState(true)
    const [editing, setEditing]       = useState(isEditMode)
    const [saving, setSaving]         = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting]     = useState(false)
    const [error, setError]           = useState('')
    const [form, setForm]             = useState({
        company:      '',
        role:         '',
        job_type:     '',
        status:       '',
        Applied_date: '',
        JD_URL:       '',
        Notes:        '',
    })

    useEffect(()=>{
        async function fetchJob(){
            try{
                const token=localStorage.getItem('token')
                const response =await fetch('http://localhost:3000/api/dashboard',{
                    headers:{'Authorization':`Bearer ${token}`}
                })
                const data=await response.json()
                if(response.ok){
                    const found=data.find(j=j.id.toString()===id)
                    if(found){
                        setJob(found)
                        setForm({
                            company:found.company || '',
                            role:found.role || '',
                            job_type:found.job_type || '',
                            status:found.status || '',
                            Applied_date:found.Applied_date || '',
                            JD_URL:found.JD_URL || '',
                            Notes:found.Notes || '',
                        })
                    }
                }
            }catch(err){
                console.error('Failed to Fetch:',err)
            }finally{
                setLoading(false)
            }
        }
        fetchJob()
    },[id])

    const handleChange=(e)=>
        setForm({...form,[e.target.name]:e.target.value})
    
    async function handleSave(){
        setSaving(true)
        setError('')
        try{
            const token    = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/dashboard/${id}`, {
                method:  'PATCH',
                headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })
            const data=await response.json()
            if (response.ok) {
                setJob({ ...job, ...form })
                setEditing(false)
                } else {
                    setError(data.error || 'Failed to save.')
                }
        }catch(err){
            setError('Something went wrong.')
        }finally{
            setSaving(false)
        }
    }

    function handleCancel(){
        setForm({
            company:job.company || '',
            role:job.role || '',
            job_type:job.job_type || '',
            status:job.status || '',
            Applied_date:job.Applied_date || '',
            JD_URL:job.JD_URL || '',
            Notes:job.Notes || '',
        })
        setLoading(false)
        setError('')
    }

    async function handleDelete(){
        setDeleting(true)
        try{
            const token    = localStorage.getItem('token')
            const response = await fetch(`http://localhost:3000/api/dashboard/${id}`, {
                method:  'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
      if (response.ok) navigate('/dashboard/applications')
        }catch(err){
            console.error('Failed to delete:', err)
        }finally{
            setDeleting(false)
        }
    }

    if (loading) return <p className="text-center mt-8 text-gray-400">Loading...</p>
    if (!job)    return <p className="text-center mt-8 text-gray-400">Application not found.</p>

    return(
        <div>
            <p>THis is application detail</p>
        </div>
    )
}