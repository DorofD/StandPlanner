import React, { Component } from "react";
import { useState } from "react";
import Button from "../../Button/Button"
import "./UserCard.css";
import { useNotificationContext } from "../../../hooks/useNotificationContext";


export default function UserCard({id, login, role, authType, picked = false, onClick, onSubmitFunc}) {

    const [selectedRole, setSelectedRole] = useState('');

    function handleRoleChange (e) {
        setSelectedRole(e.target.value);
      };
      
    const { notificationData, setNotificationData, toggleNotificationFunc, notificationToggle } = useNotificationContext();

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
                setNotificationData({message:'Пользователь удалён', type: 'success'})
                toggleNotificationFunc()

            } else {
                setNotificationData({message:'Не удалось удалить пользователя', type: 'error'})
                toggleNotificationFunc()
            }
    }

    async function changeUser() {
            if (!selectedRole) {
                console.log('changeUser error role')
                return false
            }
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'change',
                    id: id,
                    role: selectedRole

                })

            })
            if (response.status == 200) {
                const user = await response.json()
                onSubmitFunc('')
                setNotificationData({message:'Пользователь изменен', type: 'success'})
                toggleNotificationFunc()
                
            } else {
                setNotificationData({message:'Не удалось изменить пользователя', type: 'error'})
                toggleNotificationFunc()
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
                <div key={id} className={"userCardPicked"} onClick={onClick}>
                    <div className="userContent">
                        <p className="login">{login}</p>
                        <p className="params">Роль: </p>
                        <select name="role" onChange={handleRoleChange}>
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