import React from "react"
import { BrowserRouter,Routes,Route,Link,Navigate } from "react-router-dom"

import Home from "./Pages/Home"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import ForgotPassword from "./Pages/ForgotPassword"

import Layout from "./components/Layout"
import Dashboard from "./Pages/Dashboard"
import Applications from "./Pages/Applications"
import ApplicationDetail from "./Pages/ApplicationDeatil"
import Profile from "./Pages/Profile"

import ProtectedRoute from "./components/ProtectedRoute"

export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<SignIn/>}/>
                <Route path="/register" element={<SignUp/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>

                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />}/>
                    <Route path="applications" element={<Applications />}/>
                    <Route path="applications/:id" element={<ApplicationDetail/>}/>
                    <Route path="profile" element={<Profile />}/>
                </Route>
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}