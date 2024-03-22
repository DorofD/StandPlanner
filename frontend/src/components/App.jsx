import React, { useContext, useState, createContext, useEffect}from "react";
import { Routes, Route } from "react-router-dom"
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands"
import Planner from "./Planner/Planner"   
import Admin from "./Admin/Admin"   
import About from "./About/About"   
import Users from "./Users/Users";
import Bots from "./Bots/Bots";
import Logs from "./Logs/Logs";
import { PrivateRoute } from "./PrivateRoute/PrivateRoute";
import { useAuthContext } from "../hooks/useAuthContext";

export default function App() {
    const { userRole } = useAuthContext()
    return (
        <>  
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Base />}>
                            <Route index element={<Main />}/>
                            <Route path="/planner" element={<Planner />}/>
                            <Route path="/stands" element={<Stands />}/>
                            {userRole === 'admin' && <Route path="/admin" element={<Admin />}>
                                <Route path="/admin/users" element={<Users />}/>
                                <Route path="/admin/bots" element={<Bots />}/>
                                <Route path="/admin/logs" element={<Logs />}/>
                            </Route>}
                            <Route path="/about" element={<About />}/>
                        </Route>
                    </Route>
                </Routes>
        </>
    );
}
