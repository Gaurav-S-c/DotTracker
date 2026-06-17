import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"

export default function Layout(){
    return (
        <div className="flex w-full h-screen bg-[#FCFCFC] overflow-hidden">
            <Sidebar/>
            <main className="flex-1 pt-5 px-4 overflow-y-auto scroll-smooth">
                <Outlet/>
            </main>
        </div>
    )
}