import { useState } from "react"
import { FileX } from "lucide-react"

export default function DeleteAppsModal({onClose,onSuccess}){
    const [deleting,setDeleting]=useState(false)
    const [done,setDone]=useState(false)

    async function handleDelete() {
    setDeleting(true)
        try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/delete-all`, {
            method:  'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.ok) {
            onSuccess()
            setDone(true)
        }
        } catch (err) {
        console.error('Failed:', err)
        } finally {
        setDeleting(false)
        }
    }

    return(
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <FileX size={24} className="stroke-red-500"/>
                </div>

                {done ? (
                <>
                    <h3 className="text-lg font-bold text-center mb-2">All Applications Deleted</h3>
                    <p className="text-center text-gray-500 text-sm mb-6">
                    Your application history has been cleared.
                    </p>
                    <button
                    onClick={onClose}
                    className="w-full py-2 rounded-xl bg-[#4A00C9] text-white font-medium cursor-pointer"
                    >
                    Done
                    </button>
                </>
                ) : (
                <>
                    <h3 className="text-lg font-bold text-center mb-2">
                    Delete All Applications?
                    </h3>
                    <p className="text-center text-gray-500 text-sm mb-6">
                    This will permanently delete{' '}
                    <span className="font-semibold text-gray-800">all your applications</span>.
                    This action cannot be undone.
                    </p>
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
                        {deleting ? 'Deleting...' : 'Yes, Delete All'}
                    </button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}