import { useState } from "react"
import {Wand2, Rocket, Briefcase, FileText, Upload, Clock,Sparkles} from 'lucide-react'
import { motion } from "framer-motion"

export default function ResumeTailor(){
    const [jdText,setJdText]=useState('')
    const [resumeFile,setResumeFile]=useState(null)

    return(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
        >
        <div className="max-w-7xl">
            <div className="mb-6">
                <div className="flex items-center gap-3">
                    <h1 className='font-bold text-3xl text-[#4A00C9]'>
                        Resume Tailor
                    </h1>
                    <Rocket size={30} className="stroke-[#4A00C9]"/>
                </div>
                <p className="text-[#494456] text-lg font-medium">
                    Instantly optimize your resume based on job description.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F7F3FD] rounded-2xl border border-gray-100 shadow-lg p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-yellow-100">
                        <Briefcase size={25} className="stroke-yellow-500"/>
                        </div>
                        <div>
                        <h2 className="font-bold text-gray-800 text-lg">Job Details</h2>
                        <p className="text-sm font-semibold text-gray-400">Tell us what job you're aiming for</p>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-500 mt-3 mb-2 pl-2">
                        Paste JD in Text Form <span className="text-red-400">Required</span>
                    </p>

                    <textarea
                        value={jdText}
                        onChange={e => setJdText(e.target.value)}
                        placeholder="Paste the full job description here..."
                        rows={8}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#4A00C9] resize-none bg-white focus:bg-gray-50"
                    />
                </div>

                <div className="bg-[#F7F3FD] rounded-2xl border border-gray-100 shadow-lg p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="p-1.5 rounded-lg bg-red-100">
                        <FileText size={25} className="stroke-red-400"/>
                        </div>
                        <div>
                        <h2 className="font-bold text-gray-800 text-lg">Resume Details</h2>
                        <p className="text-sm font-semibold text-gray-400">Provide your current professional profile</p>
                        </div>
                    </div>

                    <p className="text-sm font-medium pl-2 text-gray-500 mt-3 mb-2">Upload File</p>
                    <label
                        htmlFor="resume-upload"
                        className="flex flex-col items-center bg-white justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#4A00C9] hover:bg-gray-50 transition-colors"
                        style={{ minHeight: '200px' }}
                    >
                        {resumeFile ? (
                            <div className="text-center p-4">
                            <FileText size={32} className="stroke-[#4A00C9] mx-auto mb-2"/>
                            <p className="text-sm font-medium text-[#4A00C9]">{resumeFile.name}</p>
                            <p className="text-xs text-gray-400 mt-1">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <button
                            onClick={e => { e.preventDefault(); setResumeFile(null) }}
                            className="text-md font-semibold text-red-400 hover:text-red-600 mt-2 cursor-pointer"
                            >
                            Remove
                            </button>
                        </div>
                        ) : (
                            <div className="text-center p-6">
                            <Upload size={32} className="stroke-gray-300 mx-auto mb-3"/>
                            <p className="text-sm font-medium text-gray-600">
                            Click to upload or drag & drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">PDF only (Max 5MB)</p>
                        </div>
                        )}
                        <input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={e => setResumeFile(e.target.files[0])}
                        />
                    </label>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                <button
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#4A00C9] text-white font-semibold text-md cursor-pointer transition-opacity shadow-lg hover:scale-110 "
                >
                <Wand2 size={18}/>
                Tailor My Resume
                </button>
            </div>

            <div className="bg-[#F7F3FD] rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Resume Suggestions</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    <Clock size={12}/>
                    Analysis Status: Waiting
                </div>
                </div>
                
                <hr className='border-t-2 border-gray-200 shadow-2xl'/>

                <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-40 h-40 rounded-2xl bg-white flex items-center justify-center mb-4">
                    <Rocket size={80} className="stroke-[#4A00C9]"/>
                </div>
                <h3 className="font-semibold text-md text-gray-700 mb-2">
                    Fill in the details above to start
                </h3>
                <p className="text-sm text-gray-500  max-w-sm">
                    Once you provide the job and resume details, we'll show you exactly
                    how to tweak your bullet points and which skills to highlight to
                    win that interview.
                </p>
                </div>
            </div>
        </div>
        </motion.div>
    )
}