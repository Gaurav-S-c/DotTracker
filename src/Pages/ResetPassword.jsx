import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Goal, Lock } from 'lucide-react'
import supabase from '../supabaseClient'

export default function ResetPassword() {
    const [password,setPassword] = useState('')
    const [confirm,setConfirm] = useState('')
    const [error,setError] = useState('')
    const [success,setSuccess] = useState(false)
    const [loading,setLoading] = useState(false)

    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()

        if(password.length < 6){
            return setError('Password must be at least 6 characters')
        }

        if(password !== confirm){
            return setError('Passwords do not match')
        }

        setLoading(true)
        setError('')

        try{
            const { error } = await supabase.auth.updateUser({
                password
            })

            if(error){
                setError(error.message)
                return
            }

            setSuccess(true)

            setTimeout(()=>{
                navigate('/login')
            },2000)

        }catch(err){
            setError('Something went wrong')
        }finally{
            setLoading(false)
        }
    }

    return (
        <main className=" relative min-h-screen flex items-center justify-center">
            <img src="/forgotpassword-bg.png" alt="sign-in background image" className="object-cover h-screen w-full absolute inset-0" />
            <div className=" relative bg-white rounded-3xl p-8 shadow-xl w-full max-w-md">

                <div className="flex justify-center mb-6">
                    <Goal className="size-10 text-[#4A00C9]" />
                </div>

                {success ? (
                    <>
                        <h2 className="text-center text-2xl font-bold text-[#4A00C9]">
                            Password Updated
                        </h2>

                        <p className="text-center mt-3 text-gray-500">
                            Redirecting to login...
                        </p>
                    </>
                ) : (
                    <>
                        <h2 className="text-center text-2xl font-bold mb-5">
                            Create New Password
                        </h2>

                        {error && (
                            <p className="bg-red-50 text-red-500 rounded-xl p-2 mb-3 text-sm">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={e=>setPassword(e.target.value)}
                                className="w-full border rounded-xl px-3 py-3 mb-3"
                            />

                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirm}
                                onChange={e=>setConfirm(e.target.value)}
                                className="w-full border rounded-xl px-3 py-3 mb-5"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4A00C9] text-white rounded-xl py-3"
                            >
                                {loading ? 'Updating...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </main>
    )
}