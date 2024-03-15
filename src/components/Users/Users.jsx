import React, { Component } from "react";
import { useState, useEffect } from "react";
import "./Users.css";
import UserCard from "./UserCard/UserCard";
import NewUserCard from "./NewUserCard/NewUserCard";

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

    const changeParentState = (newValue) => {
        console.log('picked user is changed to', newValue)
        getUsers()
        setPickedUser(newValue);
      };

    useEffect(() => {
        getUsers()
        setPickedUser('0')
    }, [])

    return (
        <div className="users">
                {
                    pickedUser === 0 &&
                        <NewUserCard id={0}
                        onClick={() => (setPickedUser(0))}
                        login={'Добавить пользователя'}
                        role={'Роль'}
                        authType={'Тип авторизации'}
                        picked={true}
                        onSubmitFunc={() => changeParentState()}></NewUserCard> 
                        ||
                        <NewUserCard id={0}
                        onClick={() => (setPickedUser(0))}
                        login={'Добавить пользователя'}
                        role={'Роль'}
                        authType={'Тип авторизации'}
                        picked={false}
                        ></NewUserCard> 
                }
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
                                picked={true}
                                onSubmitFunc={() => changeParentState()}></UserCard> 
                                ||
                                <UserCard id={user.id}
                                onClick={() => (setPickedUser(user.id))}
                                login={user.login}
                                role={user.role}
                                authType={user.auth_type}></UserCard> 
                            }
                            </>)}
                </>}
      </div>
    );
}