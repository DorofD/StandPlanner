import React from "react";
import { useState, useEffect} from "react";
import "./Login.css";
import Button from "../Button/Button";


export default function Login() {

    async function getAuth() {
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    login: 'admin',
                    password: 'admin'
                })
            })

            if (response.status == 200) {
                const user = await response.json()
                localStorage.setItem('userName', user['body']['login'])
                localStorage.setItem('userRole', user['body']['role'])
                localStorage.setItem('isAuthenticated', true)

            } else {
                console.log('unauthorized')
            }
            
            // const user = await response.json()
            // console.log(response.content)
            // console.log(user)
            
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <div>  
                <form action="">
                    
                    <Button onClick={() => getAuth()}> Auth </Button>
                </form>            
            </div>
        </>
    );
}
