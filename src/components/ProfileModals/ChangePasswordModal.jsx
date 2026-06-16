import { useState } from "react"
import { Lock } from "lucide-react"

export default function ChangePasswordModal({onClose}){
    const [form,setForm]=useState({password:'',confirm:''})
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState('')
    const [success,setSuccess]=useState(false)

    async function handleSubmit(){
        setError('')
        if(form.password.length<6)return setError('Password must be at least 6 characters')
        if(form.password !== form.confirm) return setError('Passwords do not match')
        setLoading(true)

        try{
            const token=localStorage.getItem('token')
            const response =await fetch('http://localhost:3000/api/auth/change-password',{
                method:'PATCH',
                headers:{
                    'Content-Type':"application/json",
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({password:form.password})
            })
            if (response.ok) setSuccess(true)
            else {
                const data = await response.json()
                setError(data.error || 'Failed to change password')
            }
        }catch(err){
            console.error('Something went wrong.')
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Lock size={24} className="stroke-green-500"/>
                </div>
                {success?(
                    <>
                        <h3 className="text-lg font-bold text-center mb-2">Password Changed!</h3>
                        <p className="text-center text-gray-500 text-sm mb-6">Your password has been updated successfully. </p>
                        <button onClick={onClose}
                            className="w-full py-2 rounded-xl bg-[#4A00C9] text-white font-medium cursor-pointer"
                        > 
                            Done
                        </button>
                    </>
                ):(
                    <>
                        <h3 className="text-lg font-bold text-center mb-1">Change Password.</h3>
                        <p className="text-center text-gray-500 text-sm mb-4">Enter your new password below</p>

                        {error && (
                            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl mb-3">
                                {error}
                            </p>
                        )}

                        <div className="space-y-3 mb-4">
                            <input
                                type="password"
                                placeholder="new password"
                                value={form.password}
                                onChange={e=>setForm({...form,password:e.target.value})}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={form.confirm}
                                onChange={e => setForm({ ...form, confirm: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9]"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 py-2 rounded-xl bg-[#4A00C9] text-white font-medium hover:opacity-90 disabled:opacity-60 cursor-pointer"
                            >
                                {loading ? 'Saving...' : 'Change Password'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}