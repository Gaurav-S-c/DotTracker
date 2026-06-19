import {useState} from "react"
import {X} from 'lucide-react'

export default function AddJobModal({showModal,setShowModal,selectedColumn,setjobs,onJobAdded}){
    const [formData,setFormData]=useState({
        company:"",
        role:"",
        job_type:"",
        status:"",
        Applied_date:"",
        jd_text:"",
        Notes:"",
        job_location:"",
        work_mode:"",
        resume_path:"",
    })

    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")

    const [resumeFile, setResumeFile]   = useState(null)
    const [uploadingPdf, setUploadingPdf] = useState(false)
    const [resumeUploaded, setResumeUploaded] = useState(false)

    if(!showModal)return null

    function handleChange(e){
        const {name,value}=e.target 

        setFormData((prev)=>({
            ...prev,
            [name]:value,
        }))
    }
    async function handleSubmit(e){
        e.preventDefault()
        setError('')
        setLoading(true)

        try{
            const token =localStorage.getItem('token')
            let resume_path=''

            if(resumeFile){
                setUploadingPdf(true)
                const pdfForm=new FormData()
                pdfForm.append('resume',resumeFile)

                const pdfResponse=await fetch(`${import.meta.env.VITE_API_URL}/api/resume/upload`,{
                    method:'POST',
                    headers:{'Authorization':`Bearer ${token}`},
                    body:pdfForm
                })
                const pdfData=await pdfResponse.json()
                if(!pdfResponse.ok){
                    setError(pdfData.error || 'Failed to upload resume')
                    return
                }
                resume_path = pdfData.resume_path
                setUploadingPdf(false)
                setResumeUploaded(true)
            }

            const response=await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                    company:formData.company,
                    role:formData.role,
                    job_type:formData.job_type,
                    status:formData.status || selectedColumn,
                    Applied_date:formData.Applied_date,
                    jd_text:formData.jd_text,
                    Notes:formData.Notes,
                    resume_path:resume_path,
                    work_mode:formData.work_mode,
                    job_location:formData.job_location,
                })
            })

             const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to save. Try again.')
                return
            }

            onJobAdded(data[0])
            setShowModal(false)
            setResumeFile(null)
            setResumeUploaded(false)
    
            setFormData({
               company:"",
               role:"",
               job_type:"",
               status:"",
               Applied_date:"",
               jd_text:"",
               Notes:"",
               job_location:"",
               work_mode:"",
               resume_path:""
           })
        }
        catch(err){
            console.error(err)
            setError(err.message)
        }finally{
            setLoading(false)
            setUploadingPdf(false)
        }
        
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex backdrop-blur-sm items-center justify-center z-50 ">
            <div className="w-full max-w-5xl bg-[#FCFCFC] rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
                    <h2 className="text-3xl font-bold text-[#4A00C9]">New Application</h2>
                    <button onClick={()=>setShowModal(false)}><X/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="font-medium text-sm">
                                Company Name
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                placeholder="e.g Google, Stripe..."
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50 required"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium text-sm">
                                Role
                            </label>

                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g Frontend Developer"
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium text-sm">Job Location</label>
                            <input
                            type="text"
                            name="job_location"
                            value={formData.job_location}
                            onChange={handleChange}
                            placeholder="e.g. Bangalore, Mumbai"
                            className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="font-medium text-sm">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50 required"
                            >
                                <option value="">Select Status</option>
                                <option value="wishlist">Wishlist</option>
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offers">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-medium text-sm">
                                Job Type
                            </label>

                            <select
                                name="job_type"
                                value={formData.job_type}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50 required"
                            >
                                <option value="">Select Type</option>
                                <option value="full-time">Full Time</option>
                                <option value="part-time">Part Time</option>
                                <option value="internship">Internship</option>
                                <option value="contract">Contract</option>
                                <option value="freelance">Freelance</option>
                            </select>
                        </div>

                        <div>
                            <label className="font-medium text-sm">Work Mode</label>
                            <select
                            name="work_mode"
                            value={formData.work_mode}
                            onChange={handleChange}
                            className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50"
                            >
                            <option value="">Select mode</option>
                            <option value="remote">Remote</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="onsite">Onsite</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium text-sm">
                                Date Applied
                            </label>

                            <input
                                type="date"
                                name="Applied_date"
                                value={formData.Applied_date}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50"
                                required
                            />
                        </div>

                        <div>
                            <label className="font-medium text-sm">Resume (PDF)</label>
                            <div className="mt-2">
                                <input
                                type="file"
                                accept=".pdf"
                                onChange={e => setResumeFile(e.target.files[0])}
                                className="w-full border rounded-xl px-3 py-2.5 bg-violet-50 text-sm cursor-pointer"
                                />
                                {resumeFile && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected: {resumeFile.name}
                                </p>
                                )}
                                {resumeUploaded && (
                                <p className="text-xs text-green-500 mt-1">✓ Resume uploaded</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-span-3">
                            <label className="font-medium text-sm">
                                Job Description
                            </label>

                            <p className="text-xs text-gray-500 mt-1">
                                Used by AI Resume Tailor to generate suggestions.
                            </p>

                            <textarea
                                name="jd_text"
                                value={formData.jd_text}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Paste the full job description here..."
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50 resize-none"
                            />
                    </div>

                    <div>
                        <label className="font-medium text-sm">
                            Notes
                        </label>
                        <textarea
                            rows="2"
                            name="Notes"
                            value={formData.Notes}
                            onChange={handleChange}
                            placeholder="Mention keywords from JD, recruiter details, interview notes..."
                            className="w-full mt-2 border rounded-xl px-3 py-2 resize-none bg-violet-50 h-24"
                        />
                    </div>

                    <div className="flex justify-end gap-3 " >
                        <button
                        type="button"
                        onClick={() =>
                            setShowModal(false)
                        }
                        className="px-5 py-2 rounded-xl bg-gray-100 cursor-pointer"
                        >
                        Cancel
                        </button>

                        <button
                        type="submit"
                        disabled={loading || uploadingPdf}
                        className="px-5 py-2 rounded-xl bg-violet-500 text-white cursor-pointer disabled:opacity-60"
                        >
                        {uploadingPdf ? 'Uploading PDF...' : loading ? 'Saving...' : 'Save Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}