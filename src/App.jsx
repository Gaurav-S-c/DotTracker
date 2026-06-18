import React from "react"
import { BrowserRouter,Routes,Route,Link,Navigate } from "react-router-dom"
import { useEffect } from "react"
import supabase from "./supabaseClient"

import Home from "./Pages/Home"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import ForgotPassword from "./Pages/ForgotPassword"

import Layout from "./components/Layout"
import Dashboard from "./Pages/Dashboard"
import Applications from "./Pages/Applications"
import ApplicationDetail from "./Pages/ApplicationDeatil"
import Profile from "./Pages/Profile"
import ResumeTailor from "./Pages/ResumeTailor"
import ResetPassword from "./Pages/ResetPassword"

import ProtectedRoute from "./components/ProtectedRoute"

export default function App(){
    async function restoreSession() {
    const token = localStorage.getItem('token')
    if (!token) return

    // set the session in Supabase client so it can manage refresh
    const { error } = await supabase.auth.setSession({
      access_token:  token,
      refresh_token: localStorage.getItem('refresh_token') || ''
    })

    if (error) {
      console.error('Session restore failed:', error.message)
    }
  }

    restoreSession()
    useEffect(()=>{
        const {data:listener}=supabase.auth.onAuthStateChange(
            (event,session)=>{
                if(event==='TOKEN_REFRESHED' && session){
                    localStorage.setItem('token',session.access_token)
                    localStorage.setItem('refresh_token', session.refresh_token)
                    console.log('Token refreshed automatically')
                }
                if(event==='SIGNED_OUT'){
                    localStorage.removeItem('token')
                    localStorage.removeItem('refresh_token')
                    localStorage.removeItem('user')
                    window.location.href = '/login'
                }
            }
        )
        return () => listener.subscription.unsubscribe()
    },[])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<SignIn/>}/>
                <Route path="/register" element={<SignUp/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>} />

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />}/>
                    <Route path="applications" element={<Applications />}/>
                    <Route path="applications/:id" element={<ApplicationDetail/>}/>
                    <Route path="profile" element={<Profile />}/>
                    <Route path="resume-tailor" element={<ResumeTailor />}/>
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}