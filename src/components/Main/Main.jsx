import React from "react";
import { useState, useEffect} from "react";
import "./Main.css";
import { Stand } from "../Stand/Stand"
import Button from "../Button/Button";


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
            localStorage.setItem('stands', JSON.stringify(stands))
        } catch (err) {
            setLoading('error')
        }
    }

    async function sendPost() {
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: 'admin',
                    password: 'admin'
                })
            })

            if (await response.status == 200) {
                const user = await response.json()
                
                localStorage.setItem('user', JSON.stringify(user))
            } else {
                console.log('unauthorized')
            }
            
            const user = await response.json()
            console.log(response.status)
            console.log(user)
            
        } catch (err) {
            console.log(err)
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
                
                <Button onClick={() => handleClick('btn1')}> Button1 </Button>
                <Button onClick={() => sendPost()}> Send POST </Button>
                <Button onClick={() => getStands()}> Get stands </Button>
                {content}
            </div>
        </>
    );
}
