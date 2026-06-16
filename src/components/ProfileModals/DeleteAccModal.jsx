import { useState } from "react"
import { UserRoundMinus } from "lucide-react"

export default function DeleteAccModal({onClose}){
    const [password,setPassword]=useState('')
    const [deleting,setDeleting]=useState(false)
    const [error,setError]=useState('')

    async function handleDelete(){
        if(!password) return setError('Please enter your password')
        setError('')
        setDeleting(true)
        try{    
            const token =localStorage.getItem('token')
            const response=await fetch('http://localhost:3000/api/auth/delete-account',{
                method:'DELETE',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({password})
            })
            if(response.ok){
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                localStorage.removeItem('refresh_token')
                window.location.href='/'
            }else{
                const data = await response.json()
                setError(data.error || 'Incorrect password.Try Again.')
            }

        }catch(err){
            setError('Something went wrong.')
        }finally{
            setDeleting(false)
        }
    }

    return(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <UserRoundMinus size={24} className="stroke-red-500"/>
                </div>

                <h3 className="text-lg font-bold text-center mb-1">Delete Account?</h3>
                <p className="text-center text-gray-500 text-sm mb-4">
                This will permanently delete your account and all data.
                Enter your password to confirm.
                </p>

                {error && (
                <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-xl mb-3">
                    {error}
                </p>
                )}

                <input
                type="password"
                placeholder="Enter your current password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400 mb-4"
                />

                <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-xl border-2 border-gray-200 font-medium text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                    Cancel
                </button>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
                </div>
            </div>
        </div>
    )
}