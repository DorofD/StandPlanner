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
                    Роль:{role} Тип авторизации: {authType}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div id={id} className={"userCardPicked"} onClick={onClick}>
                    <div className="userContent">
                        <p className="login">{login}</p>
                        Роль:{role} Тип авторизации: {authType}
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