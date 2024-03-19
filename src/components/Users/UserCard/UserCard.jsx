import React, { Component } from "react";
import { useState, useEffect } from "react";
import Button from "../../Button/Button"
import "./UserCard.css";

export default function UserCard({id, login, role, authType, picked = false, onClick, onSubmitFunc}) {

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
      };

    async function deleteUser(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

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

            } else {
                console.log('userCard error')
            }
            
        } catch (err) {
            console.log(err)
        }
    }

    async function changeUser(e) {
        // Prevent the browser from reloading the page
        // e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'change',
                    id: id,
                    role: selectedValue

                })

            })
            if (response.status == 200) {
                const user = await response.json()
                onSubmitFunc('')

            } else {
                console.log('userCard error')
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
                        <select name="role" onChange={handleChange}>
                                {<option value="admin" selected>Роль</option>}
                                {<option value="admin">admin</option>}
                                {<option value="user" >user</option>}
                            </select>
                        <p className="params">Тип авторизации: </p> {authType}
                    </div>
                    <div className="userButtons">
                        <Button style={'userChange'} onClick={changeUser}>Изменить</Button>
                        <Button style={'userDelete'} onClick={deleteUser}>Удалить</Button>
                    </div>
                </div>
            </>
        )
    }
}