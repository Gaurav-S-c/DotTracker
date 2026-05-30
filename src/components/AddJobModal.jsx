import {useState} from "react"
import {X} from 'lucide-react'

export default function AddJobModal({showModal,setShowModal,selectedColumn,setjobs}){
    const [formData,setFormData]=useState({
        company:"",
        role:"",
        job_type:"",
        status:"",
        Applied_date:"",
        JD_URL:"",
        Notes:""
    })

    if(!showModal)return null

    function handleChange(e){
        const {name,value}=e.target 

        setFormData((prev)=>({
            ...prev,
            [name]:value,
        }))
    }
    function handleSubmit(e){
        e.preventDefault()
        
        const newJob={
            id: crypto.randomUUID(),
            company: formData.company,
            role: formData.role,
            status:formData.status || selectedColumn,
            dateApplied: formData.dateApplied,
            notes: formData.notes,
        }
        setjobs((prev)=>[
            ...prev,
            newJob,
        ])
        
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


    return (
        <div className="fixed inset-0 bg-black/40 flex backdrop-blur-sm items-center justify-center z-50 ">
            <div className="w-125 bg-[#FCFCFC] rounded-2xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-3 border-b">
                    <h2 className="text-2xl font-bold">Add New Application</h2>
                    <button onClick={()=>setShowModal(false)}><X/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="font-medium">Company Name</label>
                        <input 
                            type="text" 
                            name="company" 
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Enter Company Name"
                            className="w-full mt-2 border rounded-xl p-3"
                            required 
                        />
                    </div>
                    <div>
                        <label className="font-medium">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            placeholder="Enter role"
                            className="w-full mt-2 border rounded-xl p-3 "
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full mt-2 border rounded-xl p-3 "
                            >
                            <option value="">Select status</option>
                            <option value="wishlist">Wishlist</option>
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="offers">Offer</option>
                            <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="font-medium">Date Applied</label>
                            <input
                                type="date"
                                name="dateApplied"
                                value={formData.dateApplied}
                                onChange={handleChange}
                                className=" w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="font-medium"> Notes</label>
                        <textarea
                            rows="4"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add notes..."
                            className="w-full mt-2 border rounded-xl p-3 resize-none"
                        />
                    </div>
                    <div className="flex justify-end gap-3 " >
                        <button
                        type="button"
                        onClick={() =>
                            setShowModal(false)
                        }
                        className="px-5 py-3 rounded-xl bg-gray-100"
                        >
                        Cancel
                        </button>

                        <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-violet-500 text-white"
                        >
                        Save Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}