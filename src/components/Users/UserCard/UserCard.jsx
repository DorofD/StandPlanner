import React, { Component } from "react";
import { useState, useEffect } from "react";
import Button from "../../Button/Button"
import "./UserCard.css";

export default function UserCard({id, login, role, authType, picked = false, onClick, onSubmitFunc}) {

    async function deleteUser(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data

        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'delete',
                    id: id
                })
            })
            if (response.status == 200) {
                const user = await response.json()
                onSubmitFunc('')
                console.log(2222222222)

            } else {
                console.log('asdasdasd')
            }
            
            
        } catch (err) {
            console.log(err)
        }
    }

    if (!picked) {
        return (
            <>
                <div id={id} className={"userCard"} onClick={onClick}>
                    <p className="login">{login}</p>
                    <p className="params">Роль: </p>{role}  <p className="params">Тип авторизации: </p> {authType}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div id={id} className={"userCardPicked"} onClick={onClick}>
                    <div className="userContent">
                        <p className="login">{login}</p>
                        <p className="params">Роль: </p>
                        <select name="" id=""> 
                                {role === 'admin' && <option value="admin" selected >admin</option> || <option value="admin">admin</option>}
                                {role === 'user' && <option value="user" selected >user</option> || <option value="user">user</option>}
                            </select>
                        <p className="params">Тип авторизации: </p> {authType}
                    </div>
                    <div className="userButtons">
                        <Button style={'userChange'}>Изменить</Button>
                        <Button style={'userDelete'} onClick={deleteUser}>Удалить</Button>
                    </div>
                </div>
            </>
        )
    }
}