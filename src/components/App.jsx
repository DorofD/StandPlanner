import React from "react";
import Base from "./Base/Base.jsx"
import Main from "./Main/Main.jsx"
import Mgmt from "./Mgmt.jsx"   
import About from "./About/About.jsx"   
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