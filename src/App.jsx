import React from "react"
import { BrowserRouter,Routes,Route,Link } from "react-router-dom"
import Layout from "./components/Layout"
import Dashboard from "./Pages/Dashboard"
import Applications from "./Pages/Applications"
import Profile from "./Pages/Profile"

export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />}/>
                    <Route path="applications" element={<Applications />}/>
                    <Route path="profile" element={<Profile />}/>

                </Route>
            </Routes>
        </BrowserRouter>
    )
}