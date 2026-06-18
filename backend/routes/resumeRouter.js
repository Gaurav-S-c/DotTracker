import express from 'express'
import multer from 'multer'
import { createRequire } from 'module'
import supabase from '../src/supabase-client.js'
import { protect } from '../middleware/authMiddleware.js'

const resumeRouter =express.Router()
const upload =multer ({storage:multer.memoryStorage(),limits:{filesize:5*1024*1024}})

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

resumeRouter.use(protect)

resumeRouter.post('/upload',upload.single('resume'),async(req,res)=>{
    try{
        const file=req.file
        if(!file) return res.status(400).json({error:'No file uploaded'})
        if(file.mimetype !=='application/pdf'){
            return res.status(400).json({error:'Only PDF files allowed'})
        }
        const pdfData = await pdfParse(file.buffer) 
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

resumeRouter.post('/parse',upload.single('resume'),async(req,res)=>{
    try{
        const file =req.file
        if(!file) return res.status(400).json({error:'No file uploaded'})
        
        const pdfData=await pdfParse(file.buffer)
        res.json({text:pdfData.text})
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

export default resumeRouter