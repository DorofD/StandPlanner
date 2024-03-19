import React, { Component } from "react";
import { useState, useEffect } from "react";
import Button from "../../Button/Button"
import "./NewUserCard.css";

export default function NewUserCard({id, role, authType, picked = false, onClick, onSubmitFunc}) {

    async function addUser(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();
    
        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        const login = formJson['login']
        const role = formJson['role']
        const authType = formJson['authType']
        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add',
                    login: login,
                    role: role, 
                    auth_type: authType
                })
            })
            if (response.status == 200) {
                const user = await response.json()
                onSubmitFunc('')

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
                <div id={id} className={"NewUserCard"} onClick={onClick}>
                    <p className="login">Добавить пользователя</p>
                </div>
            </>
        );
    } else {
        return (
            <>
            <form onSubmit={addUser}>

                <div id={id} className={"NewUserCardPicked"} onClick={onClick}>
                    <div className="NewUserContent">
                        <p className="login">Логин:  <input type="text" name="login"/></p>
                        <p className="params">Роль: </p>
                        <select name="role" id=""> 
                                {role === 'admin' && <option value="admin" selected >admin</option> || <option value="admin">admin</option>}
                                {role === 'user' && <option value="user" selected >user</option> || <option value="user">user</option>}
                            </select>
                        <p className="params">Тип авторизации: </p>
                            <select name="authType" id=""> 
                                {authType === 'ldap' && <option value="ldap" selected >ldap</option> || <option value="ldap">ldap</option>}
                                {authType === 'local' && <option value="local" selected >local</option> || <option value="local">local</option>}
                            </select> 
                    </div>
                    <div className="NewUserButtons">
                        <Button style={'UserAdd'} type={"submit"}>Добавить</Button>
                    </div>
                </div>
            </form>
            </>
        )
    }
}