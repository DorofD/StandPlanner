import React, { Component } from "react";
import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import Button from "../../Button/Button"
import "./UserCard.css";
import { useNotificationContext } from "../../App";


export default function UserCard({id, login, role, authType, picked = false, onClick, onSubmitFunc}) {

    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
      };
      
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();
    console.log('setNotification type is ', typeof(setNotificationData))
    console.log('data is ', notificationData)
    console.log(typeof(toggleNotificationFunc))
    console.log(notificationToggle)
    async function deleteUser() {
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
                console.log('userDelete error')
            }
    }

    async function changeUser() {
            if (!selectedValue) {
                console.log('changeUser error role')
                return false
            }
            // showNotification('Пользователь изменён', 'notification success')
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
                setNotificationData({message:'biba', type: 'notification success'})
                toggleNotificationFunc()
                // notification('Пользователь изменён', 'notification success')

            } else {
                console.log('userChange error')
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
                        <button ></button>
                    </div>
                </div>
            </>
        )
    }
}