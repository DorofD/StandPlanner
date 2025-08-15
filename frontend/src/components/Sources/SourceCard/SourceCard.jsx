import React, { Component } from "react";
import Button from "../../Button/Button";
import "./SourceCard.css";


export default function SourceCard({ id, value, status, picked = false, last_update, onClick }) {

    return (
        <>
            <div id={id} className={!picked && "card source" || "card source picked"} onClick={onClick}>
                <div className="sourceCardTop">
                    <p className="sourceCardValueFaded">Page ID: </p>{value}
                    <p className="sourceCardStatusFaded">Статус: </p><div className={
                        status === "relevant" && "paramValue positiveSelection" ||
                        status === "failed" && "paramValue criticalSelection" ||
                        "paramValue"
                    }>{status}</div>
                </div>
                <div className="sourceCardMiddle">
                    <p className="sourceCardUpdateFaded">Последнее обновление: </p>{last_update}
                </div>
            </div>
        </>
    )
}