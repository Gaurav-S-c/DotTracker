import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"

export default function Layout(){
    return (
        <div className="flex w-screen bg-[#FCFCFC]">
            <Sidebar/>
            <main className="flex-1 p-8">
                <Outlet/>
            </main>
        </div>
    )
}