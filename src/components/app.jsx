import React from "react";
import Base from "./base/base.jsx"
import Main from "./main/main.jsx"
import Mgmt from "./mgmt.jsx"   
import About from "./about/about.jsx"   
import {Routes, Route} from "react-router-dom";

function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Base />}>
                    <Route index element={<Main />}/>
                    <Route path="mgmt" element={<Mgmt />}/>
                    <Route path="about" element={<About />}/>
                </Route> 
            </Routes>
        </>
    );
}

export default App;