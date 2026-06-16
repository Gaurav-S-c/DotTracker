import supabase from '../src/supabase-client.js'

export const signUpNewUser=async(req,res)=>{
    const {email,password,name}=req.body;

    if(!email || !password){
        return res.status(400).json({error:'Email and password are required'});
    }

    try{
        const {data,error}=await supabase.auth.signUp({
            email:email.toLowerCase(),
            password:password,
            options:{
                data:{
                    name:name
                }
            }
        })
        if(error){
            return res.status(400).json({error:error.message})
        }

        return res.status(201).json({
            message: 'Signup successful. Check your email to confirm.',
            user: data.user,
        });
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
}

export const signInUser=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({error:"Email and Password are Required"});
    }

    try{
        const {data,error}=await supabase.auth.signInWithPassword({
            email:email.toLowerCase(),
            password:password,
        })
        if(error){
            return res.status(401).json({error:error.message})
        }
        return res.status(200).json({
            message: 'Login successful',
            token: data.session.access_token,
            refresh_token:  data.session.refresh_token, 
            user: data.user,
            });
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
}

export const logout=async(req,res)=>{

    const token = req.headers.authorization?.split(' ')[1]

    try{
        const {error}=await supabase.auth.admin.signOut(token);
        if(error){
            return res.status(400).json({error:error.message})
        }
        return res.status(200).json({ message: 'Logged out successfully' })
    }catch(error){
        return res.status(500).json({ error: error.message })
    } 
}

export const forgotPassword=async(req,res)=>{
    const {email} =req.body;
    if(!email) return res.status(400).json({error:"Email is required"})

    try{
        const {error}=await supabase.auth.resetPasswordForEmail(email,{
            redirectTo:'http://localhost:5173/reset-password'
        })
        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ message: 'Password reset email sent' });
    }catch(error){
        return res.status(500).json({ error: error.message })
    }
}

export const updateName=async(req,res)=>{
    const {name}=req.body;
    if(!name)return res.status(400).json({error:"Name is required"})

    try{
        const {error}=await supabase.auth.admin.updateUserById(
            req.user.id,
            {user_metadata:{name}}
        )
        if(error)return res.status(400).json({error:error.message}),
        res.json({message:'Name updated'})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const changePassword = async(req,res)=>{
    const{password}=req.body;
    if(!password)return res.status(400).json({error:"Password is required"})

    try{
        const {error}=await supabase.auth.admin.updateUserById(
            req,user,id,
            {password}
        )
        if(error)return res.status(400).json({error:error.message}),
        res.json({message:'Password Changes'})
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const deleteAccount=async(req,res)=>{
    const { password } = req.body
    if (!password) return res.status(400).json({ error:'Password required'})

    try{
        const {error:signInError}=await supabase.auth.signInWithPassword({
            email:req.user.email,
            password:password
        })
        if (signInError) return res.status(401).json({ error: 'Incorrect password' })

        const { error } = await supabase.auth.admin.deleteUser(req.user.id)
        if (error) return res.status(400).json({ error: error.message })

        res.json({ message: 'Account deleted' })
    }catch(err){
        res.status(500).json({error:err.message})
    }
}

export const getMe=async(req,res)=>{
    return res.status(200).json({user:req.user})
}