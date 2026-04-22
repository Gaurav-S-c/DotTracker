import supabase from "../src/supabase-client.js"

export async function getForm(req,res){
    try{
        const {data,error}=await supabase
            .from('application_form')
            .select('*')
            .eq('user_id', req.user.id)
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
         if (!req.user) {
       return res.status(401).json({ error: "Unauthorized" });
    }

        const {data,error}=await supabase
            .from('application_form')
            .insert([{
                company,role,job_type,status,Applied_date,JD_URL,Notes,user_id: req.user.id
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
    const { id } = req.params;
    try{
        const {data,error}=await supabase
            .from('application_form')
            .update(req.body)
            .eq('id', id)
            .eq('user_id', req.user.id)
            .select()

        if(error)
            return res.status(400).json({ error: error.message });

        res.json(data)
    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

export async function deleteForm(req,res){
    const { id } = req.params;
    try{
        const {data,error}=await supabase
            .from("application_form")
            .delete()
            .eq('id', id)
            eq('user_id', req.user.id)
            .select()
        if(error)
            return res.status(400).json({ error: error.message });

        res.json({ message: 'Deleted successfully' })
    }catch(error){
        res.status(500).json({error:error.message});
    }
}