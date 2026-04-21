import supabase from "./src/supabase-client.js"

export async function getForm(req,res){
    try{
        const {data,error}=await supabase
            .from('application form')
            .select('*')
            .eq('user_id',req.user.id)
            .order('created_at',{ascending:false})

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export async function insertData(req,res){
    const {company,role,job_type,status,Applied_Date,JD_URL,Notes}=req.body()
    try{
        const {data,error}=await supabase
            .from('application form')
            .insert([{
                company,role,job_type,status,Applied_Date,JD_URL,Notes,user_id:req.user.id
            }])

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
            .from('application form')
            .update(req.body)
            .eq('id',req.params.id)
            .eq('user_id',req.user.id)
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
            .from("application form")
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.user.id)

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({error:error.message});
    }
}