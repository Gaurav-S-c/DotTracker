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
        console.error('Unexpected error during sign-up:',error.message);
        return {error:error.message};
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
            token: data.session.access_token,   // send this to frontend → store it → attach to every request
            user: data.user,
            });
    }catch(error){
        console.error('Unexpected error during sign-in:', error.message);
        return { success: false, error: 'An unexpected error occurred. Please try again.' }
    }
}

export const logout=async(req,res)=>{

    const token = req.headers.authorization?.split(' ')[1]

    try{
        const {error}=await supabase.auth.signOut();
        if(error){
            return res.status(400).json({error:error.message})
        }
        return res.status(200).json({ message: 'Logged out successfully' })
    }catch(error){
        console.error('Unexpected error during sign-out:', error.message);
      return { success: false, error: 'An unexpected error occurred during sign out.' };
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
        console.error('Unexpected error during reset:', error.message);
        return { success: false, error: 'An unexpected error occurred during password reset.' };
    }
}

export const getMe=async(req,res)=>{
    return res.status(200).json({user:req.user})
}