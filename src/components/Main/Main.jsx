import React from "react";
import "./Main.css";
import { Stand } from "../Stand/Stand"
import { Button } from "../Button/Button";
import { stands as standsFromFile } from "./stands_example.js";


function StandList( {stands} ){
    const standList = []
    for (let i = 0; i < stands.length; i++) {
        standList.push(
            <Stand standName={stands[i].name} standState={stands[i].state} standOs={stands[i].os}/>
        )
    }
    return (
        standList
    )
}

function Main() {
    return (
        <>
            <div>
                <StandList stands={ standsFromFile }/>
                <Button text={'button 1'}/>
                <Button text={'button 2'}/>
            </div>
        </>
    );
}

export default Main;