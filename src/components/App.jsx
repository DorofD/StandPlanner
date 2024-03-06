import React from "react";
import {Routes, Route} from "react-router-dom"
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands"
import Planner from "./Planner/Planner"   
import Admin from "./Admin/Admin"   
import About from "./About/About"   
import Clock from "./Clock/Clock"
import Login from "./Login/Login";

function App() {
    // if (localStorage.getItem('isAuthenticated') != 'true') {
    //     return <>
    //         <Login />
    //     </>
    // }
    return (
        <>
            <Clock/>
            <Routes>
                <Route path="/" element={<Base />}>
                    <Route index element={<Main />}/>
                    <Route path="planner" element={<Planner />}/>
                    <Route path="stands" element={<Stands />}/>
                    <Route path="admin" element={<Admin />}/>
                    <Route path="about" element={<About />}/>
                </Route> 
            </Routes>
        </>
    );
}

export default App;