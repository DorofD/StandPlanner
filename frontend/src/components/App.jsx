import React, { useContext, useState, createContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom"
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands";
import Planner from "./Planner/Planner"
import Admin from "./Admin/Admin"
import About from "./About/About"
import Users from "./Users/Users";
import Bots from "./Bots/Bots";
import Logs from "./Logs/Logs";
import Apscheduler from "./Apscheduler/Apscheduler";
import Login from "./Login/Login";
import Sources from "./Sources/Sources";
import TestComponent from "./TestComponent/TestComponent";
import { PrivateRoute } from "./PrivateRoute/PrivateRoute";
import { useAuthContext } from "../hooks/useAuthContext";
import "./App.css"
import '../color_themes/App-themes-links.css';
export default function App() {
    const { userRole } = useAuthContext()
    return (
        <>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/" element={<Base />}>
                        <Route index element={<Main />} />
                        <Route path="/planner" element={<Planner />} />
                        {userRole === 'admin' && <Route path="/admin" element={<Admin />}>
                            <Route path="/admin/users" element={<Users />} />
                            <Route path="/admin/sources" element={<Sources />} />
                            <Route path="/admin/stands" element={<Stands />} />
                            <Route path="/admin/bots" element={<Bots />} />
                            <Route path="/admin/logs" element={<Logs />} />
                            <Route path="/admin/apscheduler" element={<Apscheduler />} />
                            <Route path="/admin/test" element={<TestComponent />} />
                        </Route>}
                        <Route path="/about" element={<About />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );
}
