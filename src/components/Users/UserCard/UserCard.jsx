import React, { Component } from "react";
import { useState, useEffect } from "react";
import Button from "../../Button/Button"
import "./UserCard.css";

export default function UserCard({id, login, role, authType, picked = false, onClick}) {
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
                        <p className="params">Тип авторизации: </p>
                            <select name="" id=""> 
                                {authType === 'ldap' && <option value="ldap" selected >ldap</option> || <option value="ldap">ldap</option>}
                                {authType === 'local' && <option value="local" selected >local</option> || <option value="local">local</option>}
                            </select>
                    </div>
                    <div className="userButtons">
                        <Button style={'userChange'}>Изменить</Button>
                        <Button style={'userDelete'}>Удалить</Button>
                    </div>
                </div>
            </>
        )
    }
}