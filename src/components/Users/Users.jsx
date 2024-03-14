import React, { Component } from "react";
import { useState, useEffect } from "react";
import "./Users.css";
import Button from "../Button/Button"
import UserCard from "./UserCard/UserCard";

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
                {loading === 'loaded' && <>
                            {users.map(user => <> {
                                pickedUser === user.id &&
                                <UserCard id={user.id}
                                onClick={() => (setPickedUser(user.id))}
                                login={user.login}
                                role={user.role}
                                authType={user.auth_type}
                                picked={'picked'}></UserCard> 
                                ||
                                <UserCard id={user.id}
                                onClick={() => (setPickedUser(user.id))}
                                login={user.login}
                                role={user.role}
                                authType={user.auth_type}></UserCard> 
                            }
                                    {pickedUser === user.id && <>
                                        biba
                                    </>}
                            </>)}
                </>}
      </div>
    );
}