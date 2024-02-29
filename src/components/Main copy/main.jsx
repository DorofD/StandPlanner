import React from "react";
import { useState } from "react";
import "./Main.css";
import { Stand } from "../Stand/Stand.jsx"
import { Button } from "../Button/Button.jsx";
import { stands as standsFromFile } from "./stands_example.js";



export default function Main() {
    // квадратные скобки - деструктуризация в js
    // content - первый элемент массива useState
    // setContent - функция, которая может изменять это значение
    const [content, setContent] = useState("Нажми на кнопку")

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
    
    function handleClick(type) {
        setContent(type)
    }


    return (
        <>
            <div>
                <StandList stands={ standsFromFile }/>
                <Button onClick={() =>handleClick('btn1')}> Button 1 </Button>
                <Button onClick={() =>handleClick('btn2')}> Button 2 </Button>
                {content}
            </div>
        </>
    );
}
