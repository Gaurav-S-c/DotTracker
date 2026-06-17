import express from 'express'
import multer from 'multer'
import { createRequire } from 'module'
import supabase from '../src/supabase-client.js'
import { protect } from '../middleware/authMiddleware.js'

const resumeRouter =express.Router()
const upload =multer ({storage:multer.memoryStorage()})

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

resumeRouter.use(protect)

resumeRouter.post('/upload',upload.single('resume'),async(req,res)=>{
    try{
        console.log('Upload route hit')

        const file=req.file

        console.log('File:', file?.originalname)

        if(!file) return res.status(400).json({error:'No file uploaded'})
        if(file.mimetype !=='application/pdf'){
            return res.status(400).json({error:'Only PDF files allowed'})
        }

        const pdfData = await pdfParse(file.buffer)

        console.log('PDF parsed successfully')
        
        const text=pdfData.text

        const fileName=`${req.user.id}/${Date.now()}.pdf`
        const {data,error}=await supabase.storage.from('resumes').upload(fileName,file.buffer,{
            contentType:'application/pdf',
            upsert:true
        })

        if(error)return res.status(400).json({error:error.message})

        const {data:urlData}=supabase.storage.from('resumes').getPublicUrl(fileName)
        return res.json({
            resume_path:fileName,
            resume_text:text
        })
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

resumeRouter.get('/signed-url',async (req,res)=>{
    const {path}=req.query
    if(!path) return res.status(400).json({error:'Path required'})
    try{
        const {data,error}=await supabase.storage.from('resumes').createSignedUrl(path,60*60)

        if(error) return res.status(400).json({ error: error.message })
        res.json({ url: data.signedUrl })
    }catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default resumeRouter