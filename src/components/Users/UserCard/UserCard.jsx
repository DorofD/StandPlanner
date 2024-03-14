import React, { Component } from "react";
import { useState, useEffect } from "react";
import "./UserCard.css";

export default function UserCard({id, login, role, authType, picked = '', onClick}) {
    if (!picked) {
        return (
            <>
                <div id={id} className={"userCard " + picked} onClick={onClick}>
                    <p>{login}</p>
                    <br />
                    {role} {authType}
                </div>
            </>
        );
    } else {
        return (
            <>
                <div id={id} className={"userCard " + picked} onClick={onClick}>
                    <p>{login}</p>
                    <br />
                    {role} {authType}
                </div>
            </>
        )
    }
}