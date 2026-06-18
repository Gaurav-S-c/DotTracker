import { useState,useRef } from "react"
import {Wand2, Rocket, Briefcase, FileText, Upload, Clock,Sparkles,AlertCircle,Zap,CheckCircle,Target,Star} from 'lucide-react'
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"

export default function ResumeTailor(){
    const [jdText,setJdText]=useState('')
    const [resumeFile,setResumeFile]=useState(null)
    const [loading,setLoading]=useState(false)
    const [status,setStatus]=useState('waiting')
    const [result,setResult]=useState(null)
    const [error,setError]=useState('')
    const [loadingAI,setLoadingAI] = useState(false)

    const fileInputRef = useRef(null)

    function handleRemoveResume() {
        setResumeFile(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
        }

    async function handleTailor(){
        if(!jdText.trim()) return setError('Please paste a job description.')
        if(!resumeFile) return setError('Please upload your resume PDF.')
        setError('')
        setResult(null)
        setLoading(true)

        try{
            const token =localStorage.getItem('token')

            setStatus('parsing')
            const pdfForm=new FormData()
            pdfForm.append('resume',resumeFile)

            const parseResponse=await fetch ('http://localhost:3000/api/resume/parse',{
                method:'POST',
                headers:{'Authorization':`Bearer ${token}`},
                body:pdfForm
            })

            const parseData=await parseResponse.json()

            if (!parseData.text || !parseData.text.trim()) {
                setError(
                    'No readable text found in the PDF. Please upload a text-based resume PDF.'
                )
                setStatus('error')
                setLoading(false)
                return
            }

            if(!parseResponse.ok){
                setError(parseData.error || 'Failed to parse the resume')
                setStatus('error')
                return
            }

            console.log(parseData.text)

            setStatus('analyzing')
            const aiResponse=await fetch('http://localhost:3000/api/ai/tailor',{
                method: 'POST',
                headers:{
                    'Content-type':'application/json',
                    'Authorization':`Bearer ${token}`
                },
                body:JSON.stringify({
                    jd_text:jdText,
                    resume_text:parseData.text
                })
            })
            const aiData = await aiResponse.json()
            if (!aiResponse.ok) {
                setError(aiData.error || 'AI analysis failed.')
                setStatus('error')
                return
            }

            setResult(aiData)
            setStatus('done')
        }catch (err) {
            setError('Something went wrong. Check your connection.')
            setStatus('error')
        } finally {
            setLoading(false)
        }
    }
    function getScoreColor(score) {
        if (score >= 75) return '#16A34A'
        if (score >= 50) return '#D97706'
        return '#DC2626'
    }

    function getScoreBg(score) {
        if (score >= 75) return '#DCFCE7'
        if (score >= 50) return '#FEF3C7'
        return '#FEE2E2'
    }

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
                        <p className="text-sm font-semibold text-gray-400">Provide your current professional resume</p>
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
                        ref={fileInputRef}
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onClick={handleRemoveResume}
                        onChange={e => setResumeFile(e.target.files[0])}
                        />
                    </label>
                </div>
            </div>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl mb-4 text-center">
                {error}
                </p>
            )}

            <div className="flex justify-center mb-6">
                <button
                onClick={handleTailor}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#4A00C9] text-white font-semibold text-md cursor-pointer transition-opacity shadow-lg hover:scale-110 "
                >
                <Wand2 size={18}/>
                {loading
                    ? status==='parsing' ? 'parsing Resume...'
                    : status==='analyzing' ? 'AI Analyzing...'
                    : 'Loading...'
                    : 'Tailor My Resume'
                }
                </button>
            </div>

            <div className="bg-[#F7F3FD] rounded-2xl border border-gray-100 shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Resume Suggestions</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    <Clock size={12}/>
                    Analysis Status: {''}
                    <span className={
                        status === 'done'      ? 'text-green-500' :
                        status === 'error'     ? 'text-red-500'   :
                        status === 'analyzing' ? 'text-[#4A00C9]' :
                        status === 'parsing'   ? 'text-yellow-500':
                        'text-gray-400'
                        }>
                        {status === 'waiting'   ? 'Waiting'    :
                        status === 'parsing'   ? 'Parsing PDF':
                        status === 'analyzing' ? 'Analyzing'  :
                        status === 'done'      ? 'Complete'   :
                        'Error'}
                    </span>
                </div>
                </div>
                
                <hr className='border-t-2 border-gray-200 shadow-2xl'/>

                {status==='waiting' && (
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
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 rounded-full border-4 border-purple-100 border-t-[#4A00C9] animate-spin mb-4"/>
                        <p className="text-sm font-medium text-gray-600">
                        {status === 'parsing'   ? 'Reading your resume PDF...'     :
                        status === 'analyzing' ? 'AI is analyzing your resume...' :
                        'Processing...'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">This takes about 10-15 seconds</p>
                    </div>
                )}

                {status === 'error' && !loading && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle size={40} className="stroke-red-400 mb-3"/>
                        <p className="font-semibold text-gray-700">Something went wrong</p>
                        <p className="text-sm text-gray-400 mt-1">{error}</p>
                    </div>
                )}

                {status === 'done' && result && !loading && (
                    <div className="space-y-6 mt-5">

                        <div className="flex items-center gap-4 p-4 rounded-2xl shadow-sm"
                            style={{ backgroundColor: getScoreBg(result.match_score) }}
                            >
                            <div
                                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 font-bold"
                                style={{ backgroundColor: getScoreColor(result.match_score), color: '#fff' }}
                            >
                                <span className="text-2xl leading-none">{result.match_score}</span>
                                <span className="text-md">/ 100</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-md mb-1">Match Score</p>
                                <p className="text-md text-gray-600 leading-relaxed">{result.summary}</p>
                            </div>
                        </div>

                        {result.quick_wins?.length >0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                <Zap size={25} className="stroke-yellow-500"/>
                                <h3 className="font-semibold text-xl text-gray-800">Quick Wins</h3>
                                </div>
                                <div className="space-y-2">
                                {result.quick_wins.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-yellow-50 shadow-sm rounded-xl px-3 py-2">
                                    <CheckCircle size={16} className="stroke-yellow-500 mt-0.5 shrink-0"/>
                                    <p className="text-md text-gray-700">{tip}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {result.keywords_to_add?.length > 0 && (
                                <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Target size={25} className="stroke-green-500"/>
                                    <h3 className="font-semibold text-gray-800 text-xl">Keywords to Add</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords_to_add.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium border border-green-200 shadow-sm">
                                        + {kw}
                                    </span>
                                    ))}
                                </div>
                                </div>
                            )}

                            {result.keywords_missing?.length > 0 && (
                                <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle size={25} className="stroke-red-400"/>
                                    <h3 className="font-semibold text-gray-800 text-xl">Keywords Missing</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords_missing.map((kw, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium border border-red-200 shadow-sm">
                                        ✕ {kw}
                                    </span>
                                    ))}
                                </div>
                                </div>
                            )}
                        </div>    

                        {result.skills_to_highlight?.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                <Star size={25} className="stroke-[#2591da]"/>
                                <h3 className="font-semibold text-xl text-gray-800">Skills to Highlight</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                {result.skills_to_highlight.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-blue-50 shadow-sm text-[#2591da] text-sm font-medium border border-blue-200">
                                    ★ {skill}
                                    </span>
                                ))}
                                </div>
                            </div>
                            )}

                        {result.bullet_improvements?.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                <Wand2 size={25} className="stroke-[#4A00C9]"/>
                                <h3 className="font-semibold text-xl text-gray-800">Bullet Point Improvements</h3>
                                </div>
                                <div className="space-y-3">
                                {result.bullet_improvements.map((item, i) => (
                                    <div key={i} className=" border border-gray-100">
                                    <div className="bg-red-100 px-4 py-2 mb-2 shadow-sm rounded-xl">
                                        <p className="text-sm font-bold text-red-400 uppercase mb-1">Before</p>
                                        <p className="text-md text-gray-700">{item.original}</p>
                                    </div>
                                    <div className="bg-green-100 px-4 py-2 shadow-sm rounded-xl">
                                        <p className="text-sm font-bold text-green-500 uppercase mb-1">After</p>
                                        <p className="text-md text-gray-700">{item.improved}</p>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
        </motion.div>
    )
}