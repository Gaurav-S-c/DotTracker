import {useState} from "react"
import {X} from 'lucide-react'

export default function AddJobModal({showModal,setShowModal,selectedColumn,setjobs,onJobAdded}){
    const [formData,setFormData]=useState({
        company:"",
        role:"",
        job_type:"",
        status:"",
        Applied_date:"",
        JD_URL:"",
        Notes:""
    })

    const [loading,setLoading]=useState(false)
    const [error,setError]=useState("")

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
            const response=await fetch('http://localhost:3000/api/dashboard',{
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
                    JD_URL:formData.JD_URL,
                    Notes:formData.Notes,
                })
            })

             const data = await response.json()

            if (!response.ok) {
                setError(data.error || 'Failed to save. Try again.')
                return
            }

            onJobAdded(data[0])
           
           setShowModal(false)
    
           setFormData({
               company:"",
               role:"",
               job_type:"",
               status:"",
               Applied_date:"",
               JD_URL:"",
               Notes:""
           })
        }
        catch(err){
            setError('Something went wrong. Check your connection.')
        }finally{
            setLoading(false)
        }
        
    }


    return (
        <div className="fixed inset-0 bg-black/40 flex backdrop-blur-sm items-center justify-center z-50 ">
            <div className="w-full max-w-130 bg-[#FCFCFC] rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">
                    <h2 className="text-3xl font-bold text-[#4A00C9]">New Application</h2>
                    <button onClick={()=>setShowModal(false)}><X/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                            />
                        </div>

                        <div>
                            <label className="font-medium text-sm">
                                Job Description URL
                            </label>

                            <input
                                type="url"
                                name="JD_URL"
                                value={formData.JD_URL}
                                onChange={handleChange}
                                placeholder="https://linkedin.com/jobs/..."
                                className="w-full mt-2 border rounded-xl px-3 py-2 bg-violet-50"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="font-medium text-sm">
                            Notes
                        </label>
                        <textarea
                            rows="3"
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
                        disabled={loading}
                        className="px-5 py-2 rounded-xl bg-violet-500 text-white cursor-pointer"
                        >
                        {loading ? 'Saving...' : 'Save Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}