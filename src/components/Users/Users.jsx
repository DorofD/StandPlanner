import React, { Component } from "react";
import { useState, useEffect } from "react";
import "./Users.css"

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState('loading')
    const [pickedUser, setPickedUser] = useState()

    async function getUsers() {
        try {
            setLoading('loading')
            const response = await fetch('http://127.0.0.1:5000/users', {
                method: 'GET',
            })
            const users = await response.json()
            setUsers(users)
            setLoading('loaded')
        } catch (err) {
            setLoading('error')
        }
    }
    
    

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div className="users">
            Управление пользователями
            {loading === 'loading' && <p> Loading ...</p>}
            {loading === 'error' && <p> бекенд отвалился</p>}
            {loading === 'loaded' && <ul>
                        {users.map(user => <>
                            <li className={pickedUser === user.id && "picked user" || "user"}
                                id={user.id} onClick={() => (setPickedUser(user.id))}>
                                    {user.login} {user.role} {user.auth_type}
                            </li>
                        </>)}
                                    </ul>}
      </div>
    );
}