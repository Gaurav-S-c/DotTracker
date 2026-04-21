import supabase from "../src/supabase-client.js"

export async function getForm(req,res){
    try{
        const {data,error}=await supabase
            .from('application_form')
            .select('*')
            .order('created_at',{ascending:false})

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export async function insertData(req,res){
    const {company,role,job_type,status,Applied_date,JD_URL,Notes}=req.body
    try{
        const {data,error}=await supabase
            .from('application_form')
            .insert([{
                company,role,job_type,status,Applied_date,JD_URL,Notes
            }])
            .select()

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export async function updateForm(req,res){
    try{
        const {data,error}=await supabase
            .from('application_form')
            .update(req.body)
            .select()

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export async function deleteForm(req,res){
    try{
        const {data,error}=await supabase
            .from("application_form")
            .delete()
            .eq('id', req.params.id)
            .select()
        if(error)
            return res.status(400).json({ error: error.message });

        res.json({ message: 'Deleted successfully' })
    }catch(error){
        res.status(500).json({error:error.message});
    }
}