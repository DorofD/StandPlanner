import React, { Component } from "react";
import "./StandCard.css";


export default function StandCard({id, name, onClick, picked = false}) {
    if (!picked) {
        picked = "standCard"
    } else {
        picked = "standCardPicked"
    }

    return (
        <>
            <div id={id} className={picked} onClick={onClick}>
                <p className="name">{name}</p>
            </div>
        </>
    )
}