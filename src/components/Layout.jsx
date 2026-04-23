import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"

export default function Layout(){
    return (
        <div className="site-wrapper">
            <Sidebar/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}