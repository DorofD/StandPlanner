import React, { Component } from "react";
import Button from "../../Button/Button";
import "./SourceCard.css";


export default function SourceCard({ id, valueName, value, status, picked = false, updated_at, onClick }) {

    return (
        <>
            <div id={id} className={!picked && "card source" || "card source picked"} onClick={onClick}>
                <div className="sourceCardTop">
                    <p className="sourceCardValueFaded">{valueName} </p>{value}
                    <p className="sourceCardStatusFaded">Статус: </p><div className={
                        status === "relevant" && "paramValue success-colors" ||
                        status === "failed" && "paramValue error-colors" ||
                        "paramValue"
                    }>{status}</div>
                </div>
                <div className="sourceCardMiddle">
                    <p className="sourceCardUpdateFaded">Последнее обновление: </p>{updated_at}
                </div>
            </div>
        </>
    )
}