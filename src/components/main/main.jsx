import React from "react";
import "./main.css";
import { Button } from "./button.jsx"
import { stands } from "./stands.js"


function Main() {
    return (
        <>
            <div>

                {stands[0].name + stands[0].state + stands[0].os}
                <br />
                {stands[1].name + stands[1].state + stands[1].os}
                <br />
                {stands[2].name + stands[2].state + stands[2].os}
                <br />
                <Button text={'button 1'}/>
                <Button text={'button 2'}/>
            </div>
        </>
    );
}

export default Main;