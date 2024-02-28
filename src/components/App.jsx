import React from "react";
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands"
import Planner from "./Planner/Planner"   
import Admin from "./Admin/Admin"   
import About from "./About/About"   
import {Routes, Route} from "react-router-dom";

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Base />}>
                    <Route index element={<Main />}/>
                    <Route path="planner" element={<Planner />}/>
                    <Route path="stands" element={<Stands />}/>
                    <Route path="Admin" element={<Admin />}/>
                    <Route path="about" element={<About />}/>
                </Route> 
            </Routes>
        </>
    );
}

export default App;