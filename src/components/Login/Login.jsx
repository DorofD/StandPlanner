import React from "react";
import { useState, useEffect} from "react";
import "./Login.css";
import Button from "../Button/Button";
import { useAuthContext } from "../App";

export default function Login() {
    const { isAuthenticated, toogleAuth} = useAuthContext()
    const { userName, setUserName} = useAuthContext()
    const [status, setStatus] = useState('')

    async function getAuth(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        const username = formJson['username']
        const password = formJson['password']
        setStatus('loading')
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: username,
                    password: password
                })
            })
            if (response.status == 200) {
                const user = await response.json()
                setUserName(username)
                toogleAuth()

            } else {
                setStatus('error')
                console.log('unauthorized')
            }
            
            
        } catch (err) {
            console.log(err)
        }
        
    }
    return (
        <>
            <div className="login">  
                <form className="login" onSubmit={getAuth}>
                    <input type="text" name="username" placeholder="username"/>
                    <input type="password" name="password" placeholder="password" autoComplete="on"/>
                    <Button style={"login"} type={"submit"}> Войти </Button>

                    {status === 'loading' && <div className="loading"> Ожидайте </div>}
                    {status === 'error' && <div className="error"> Не удалось войти </div>}
                </form>     
            </div>
        </>
    );
}
