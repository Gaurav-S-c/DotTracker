import express from 'express'
import Groq from 'groq-sdk'
import { protect } from '../middleware/authMiddleware.js'

const groqRouter=express.Router()
const groq =new Groq({apiKey:process.env.GROQ_API_KEY})

groqRouter.use(protect)

groqRouter.post('/tailor',async (req,res)=>{
    const {jd_text,resume_text}=req.body

    if (!jd_text)     return res.status(400).json({ error: 'Job description is required' })
    if (!resume_text) return res.status(400).json({ error: 'Resume text is required' })

    try{
        const completion = await groq.chat.completions.create({
            model:'llama-3.3-70b-versatile',
            max_tokens:1500,
            messages: [
        {
          role:    'system',
          content: 'You are a senior technical recruiter, ATS specialist, hiring manager, and resume coach.Your reviews must be detailed, specific, recruiter-focused, and highly actionable.Always return valid JSON only.'
        },
        {
          role:    'user',
          content: `Perform a comprehensive ATS, recruiter, and hiring-manager level analysis of this resume against the job description.
                    Your objective is to identify every meaningful gap between the candidate's resume and the requirements of the role.
                    Analyze:
                    - Technical skills match
                    - Missing keywords
                    - Missing tools and frameworks
                    - ATS optimization opportunities
                    - Missing projects
                    - Missing achievements and metrics
                    - Skills that should be highlighted
                    - Resume strengths
                    - Resume weaknesses
                    - Recruiter concerns
                    - Bullet point improvements
                    Do not provide generic advice.
                    Every suggestion must be based on the actual job description and resume content.
                    Be thorough and exhaustive rather than concise.
                    Identify as many relevant improvements as possible that would increase the candidate's chances of passing ATS screening and getting shortlisted by recruiters.
          JOB DESCRIPTION:
            ${jd_text}

            RESUME:
            ${resume_text}

            Respond with this exact JSON structure:
            {
            "match_score": <number 0-100>,
            "summary": "<2 sentence overview of how well resume fits>",
            "keywords_to_add": ["keyword1", "keyword2", "keyword3"],
            "keywords_missing": ["missing1", "missing2"],
            "bullet_improvements": [
                { "original": "original bullet point", "improved": "improved version" }
            ],
            "skills_to_highlight": ["skill1", "skill2"],
            "quick_wins": ["quick tip 1", "quick tip 2", "quick tip 3"]
            }`
                }
            ]
        })

        const text =completion.choices[0].message.content
        const cleaned = text.replace(/```json|```/g,'').trim()
        const result =JSON.parse(cleaned)

        res.json(result)  
    }
    catch (err) {
    console.error('Groq error:', err)
    res.status(500).json({ error: err.message })
  }
})

export default groqRouter