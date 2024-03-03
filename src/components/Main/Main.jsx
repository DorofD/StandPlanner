import React from "react";
import { useState, useEffect} from "react";
import "./Main.css";
import { Stand } from "../Stand/Stand"
import { Button } from "../Button/Button";


export default function Main() {
    // квадратные скобки - деструктуризация в js
    // content - первый элемент массива useState
    // setContent - функция, которая изменяет это значение
    const [content, setContent] = useState("Нажми на кнопку")
    const [loading, setLoading] = useState('loading')
    const [stands, setStands] = useState([])

    // function StandList( {stands} ){
    //     const standList = []
    //     for (let i = 0; i < stands.length; i++) {
    //         standList.push(
    //             <Stand standName={stands[i].name} standState={stands[i].state} standOs={stands[i].os}/>
    //         )
    //     }
    //     return (
    //         standList
    //     )
    // }
    
    function handleClick(type) {
        setContent(type)
    }
    
    
    async function getStands() {
        try {
            setLoading('loading')
            const response = await fetch('http://127.0.0.1:5000', {
                method: 'GET',
            })
            const stands = await response.json()
            setStands(stands)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }

    useEffect(() => {
        getStands()
    }, [])

    return (
        <>
            <div>
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && <ul>
                        {stands.map(stand => <li key={stand.id}>{stand.name} | {stand.os} | {stand.state}</li>)}
                    </ul>}
                
                <Button onClick={() =>handleClick('btn1')}> Button 1 </Button>
                <Button onClick={() => getStands()}> Request </Button>
                {content}
            </div>
        </>
    );
}
