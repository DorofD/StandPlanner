import React, { Component } from "react";
import "./StandCard.css";


export default function StandCard({ id, name, source_type, status, last_update, onClick, picked = false }) {

    return (
        <>
            <div id={id} className={picked && "card sourcesStand picked" || "card sourcesStand"} onClick={onClick}>
                <div className="sourceStandCardHeader">
                    <p className="sourceStandName">{name}</p>
                </div>
                <div className="sourcesStandCardBottom">
                    <p className="sourceCardValueFaded">Статус: </p>{status}
                    <p className="sourceCardStatusFaded">Источник: </p>{source_type}
                </div>
            </div>
        </>
    )
}