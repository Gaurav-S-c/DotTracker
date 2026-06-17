import { useState,useEffect } from "react"
import { useParams,useNavigate,useSearchParams } from "react-router-dom"
import { ArrowLeft,Pencil,Trash2,TriangleAlert,Check,X,Wand2 } from "lucide-react"
import { motion } from "framer-motion"

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
        company:'',
        role:'',
        job_type:'',
        status:'',
        Applied_date:'',
        jd_text:'',
        Notes:'',
        work_mode:'',
        job_location:'',
        resume_path:'',
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
                    const found=data.find(j=>j.id.toString()===id)
                    if(found){
                        setJob(found)
                        setForm({
                            company:found.company || '',
                            role:found.role || '',
                            job_type:found.job_type || '',
                            status:found.status || '',
                            Applied_date:found.Applied_date || '',
                            jd_text:found.jd_text || '',
                            Notes:found.Notes || '',
                            resume_path:found.resume_path || '',
                            work_mode:found.work_mode || '',
                            job_location:found.job_location || '',
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

    const [uploadingResume, setUploadingResume] = useState(false)
    const [resumeUrl, setResumeUrl]= useState(null)
    const [loadingResume, setLoadingResume]= useState(false)
    
    async function handleResumeUpload(e){
        const file =e.target.files[0]
        if(!file) return 
        setUploadingResume(true)

        try{
            const token =localStorage.getItem('token')
            const pdfForm=new FormData()
            pdfForm.append('resume',file)

            const response =await fetch('http://localhost:3000/api/resume/upload',{
                method:'POST',
                headers:{'Authorization':`Bearer ${token}`},
                body:pdfForm
            })

            const data = await response.json()
            if(response.ok){
                setForm(prev => ({...prev,resume_path:data.resume_path}))
            }else{
                setError(data.error || 'Failed to upload resume')
            }
        }
        catch(err){
            setError('Resume upload failed.')
        }
        finally{
            setUploadingResume(false)
        }
    }

    async function fetchResumeUrl() {
        if (!job.resume_path) return
        setLoadingResume(true)
        try {
            const token    = localStorage.getItem('token')
            const response = await fetch(
            `http://localhost:3000/api/resume/signed-url?path=${job.resume_path}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
            )
            const data = await response.json()
            if (response.ok) {
            window.open(data.url, '_blank')  // open directly
            }
        } catch (err) {
            console.error('Failed to get resume URL:', err)
        } finally {
            setLoadingResume(false)
        }
    }
    
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
            jd_text:job.jd_text || '',
            Notes:job.Notes || '',
            resume_path:job.resume_path || '',
            work_mode:job.work_mode || '',
            job_location:job.job_location || '',
        })
        setEditing(false)
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
        <div className="max-w-5xl">
            <div className="mb-3">
                <h1 className="text-3xl font-bold text-[#171A1D] mb-3">Application Details.</h1>
                <button 
                    onClick={()=>navigate('/dashboard/applications')}
                    className="flex items-center gap-1 text-md text-gray-400 hover:text-[#4A00C9] mt-1 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={14}/>
                    <span>Back to applications.</span>
                </button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 ml-40 max-h-[95vh] mb-5 ">
                {error && (
                    <p className="text-red-500 text-sm bg-red-100 px-4 py-2 rounded-xl mb-3">
                        {error}
                    </p>
                )}
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                        style={{ background: '#EDE9FE', color: '#4A00C9' }}
                    >
                        {(editing ? form.company:job.company)?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center pr-5">
                            <div>
                                {editing ? (
                                    <input
                                        name='company'
                                        value={form.company}
                                        onChange={handleChange}
                                        className="text-xl font-bold text-[#4A00C9] border-b-2 border-[#c5a6fb] focus:outline-none focus:border-[#8139ff] bg-transparent w-full mb-1"
                                    />
                                ):(
                                    <h2 className="text-3xl font-bold text-[#4A00C9]">{job.company.toUpperCase()}</h2>
                                )}
                            </div>
                            <div>
                                {editing ? (
                                    <input
                                        name='role'
                                        value={form.role}
                                        onChange={handleChange}
                                        className="text-xl font-bold text-[#4A00C9] border-b-2 border-[#c5a6fb] focus:outline-none focus:border-[#8139ff] bg-transparent w-full mb-1"
                                    />
                                ):(
                                    <h2 className="text-xl font-bold text-[#4A00C9]">{job.role}</h2>
                                )}
                            </div>
                        </div>
                        <div>
                            {editing ?(
                                <select
                                    name='status'
                                    value={form.status}
                                    onChange={handleChange}
                                    className="border border-[#c5a6fb] rounded-full px-3 py-0.5 text-xs font-semibold focus:outline-none focus:border-[#4A00C9] text-[#4A00C9]"
                                >
                                    <option value="wishlist">Wishlist</option>
                                    <option value="applied">Applied</option>
                                    <option value="interview">Interview</option>
                                    <option value="offers">Offer</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            ):(
                                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${
                                    STATUS_STYLES[job.status] || 'border border-gray-300 text-gray-500'
                                    }`}
                                >
                                        {job.status}
                                    </span>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="border-gray-300 mb-4"/>

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                    <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Date Applied
                        </p>
                        {editing ? (
                        <input
                            type="date"
                            name="Applied_date"
                            value={form.Applied_date}
                            onChange={handleChange}
                            className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                        />
                        ) : (
                        <p className="text-gray-700 font-medium">
                            {job.Applied_date
                            ? new Date(job.Applied_date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'long', year: 'numeric'
                                })
                            : '—'}
                        </p>
                        )}
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Job Type
                        </p>
                        {editing ? (
                        <select
                            name="job_type"
                            value={form.job_type}
                            onChange={handleChange}
                            className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                        >
                            <option value="">Select type</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                            <option value="freelance">Freelance</option>
                        </select>
                        ) : (
                        <p className="text-gray-700 font-medium capitalize">
                            {job.job_type || '—'}
                        </p>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Job Location
                        </p>
                        {editing ? (
                        <input
                            name="job_location"
                            value={form.job_location}
                            onChange={handleChange}
                            placeholder='e.g. Bangalore...'
                            className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                        />
                        ) : (
                        <p className="text-gray-700 font-medium">
                           📍{job.job_location || '—'}
                        </p>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Work Mode
                        </p>
                        {editing ? (
                        <select
                            name="work_mode"
                            value={form.work_mode}
                            onChange={handleChange}
                            className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                        >
                            <option value="">Select mode</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                        </select>
                        ) : (
                        <p className="text-gray-700 font-medium">
                           💼{job.work_mode || '—'}
                        </p>
                        )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                            Resume
                        </p>
                        {editing ? (
                            <div>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleResumeUpload}
                                className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm cursor-pointer bg-white"
                            />
                            {uploadingResume && (
                                <p className="text-xs text-purple-500 mt-1">Uploading resume...</p>
                            )}
                            {form.resume_path && (
                                <p className="text-xs text-green-500 mt-1">Resume uploaded</p>
                            )}
                            </div>
                        ) : (
                            job.resume_path ? (
                                <button
                                onClick={fetchResumeUrl}
                                disabled={loadingResume}
                                className="text-[#4A00C9] hover:underline text-sm cursor-pointer disabled:opacity-60"
                                >
                                {loadingResume ? 'Opening...' : 'View Resume ↗'}
                                </button>
                                ): (
                                <p className="text-gray-700 font-medium">—</p>
                            )
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-3 col-span-2 mb-5 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                        Job Description
                    </p>
                    {editing ? (
                        <textarea
                        name="jd_text"            
                        value={form.jd_text}       
                        onChange={handleChange}
                        rows={4}
                        placeholder="Paste the job description here..."
                        className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9] resize-none bg-white"
                        />
                    ) : (
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {job.jd_text || 'No job description added yet'}       
                        </p>
                    )}
                </div>
    
                <div className="bg-gray-50 rounded-xl p-4 mb-6 shadow-sm">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                        Notes
                    </p>
                    {editing ? (
                        <textarea
                        name="Notes"
                        value={form.Notes}
                        onChange={handleChange}
                        rows={2}
                        placeholder="Add your notes here..."
                        className="w-full border border-[#c5a6fb] rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9] resize-none bg-white"
                        />
                    ) : (
                        <p className="text-gray-700 text-sm leading-relaxed">
                        {job.Notes || 'No notes added yet.'}
                        </p>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex justify-center">
                        <button
                        onClick={()=>{navigate('/dashboard/resume-tailor')}}
                        className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#4A00C9] text-white font-semibold text-md cursor-pointer transition-opacity shadow-lg hover:scale-110 "
                        >
                        <Wand2 size={18}/>
                            Tailor My Resume
                        </button>
                    </div>
                    {editing ? (
                        <div className="flex justify-end gap-3">
                            <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                            <X size={14}/> Cancel
                            </button>
                            <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#4A00C9] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 cursor-pointer"
                            >
                            <Check size={14}/> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                        ) : (
                        <div className="flex justify-end gap-3">
                            <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#4A00C9] text-white text-sm font-medium hover:opacity-90 cursor-pointer"
                            >
                            <Pencil size={14}/> Edit
                            </button>
                            <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 cursor-pointer"
                            >
                            <Trash2 size={14}/> Delete
                            </button>
                        </div>
                        )}
                </div>

            </div>
            {showConfirm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                    <TriangleAlert size={28} color="#FFAB03"/>
                    </div>
                    <h3 className="text-lg font-bold text-center mb-2">Delete Application?</h3>
                    <p className="text-center text-gray-500 text-sm mb-6">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-800">{job.company}</span>?
                    This cannot be undone.
                    </p>
                    <div className="flex gap-3">
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                    >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
        </motion.div>
    )
}