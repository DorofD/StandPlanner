import React from "react";
import { useState, useEffect, useContext} from "react";
import "./Main.css";
import Button from "../Button/Button";
import { AuthContext, useAuthContext } from "../App";


export default function Main() {
    // квадратные скобки - деструктуризация в js
    // content - первый элемент массива useState
    // setContent - функция, которая изменяет это значение
    const [content, setContent] = useState("Нажми на кнопку")
    const [loading, setLoading] = useState('loading')
    const [stands, setStands] = useState([])
    const { isAuthenticated} = useAuthContext()

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
            <div className="main">
                {loading === 'loading' && <p> Loading ...</p>}
                {loading === 'error' && <p> бекенд отвалился</p>}
                {loading === 'loaded' && <ul>
                        {stands.map(stand => <li key={stand.id}>{stand.name} | {stand.os} | {stand.state}</li>)}
                    </ul>}
                <Button onClick={() => handleClick('btn1')}> Button1 </Button>
                <Button onClick={() => getStands()}> Get stands </Button>
                {content}
            </div>
        </>
    );
}
