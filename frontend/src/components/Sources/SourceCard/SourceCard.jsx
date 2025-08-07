import React, { Component } from "react";
import Button from "../../Button/Button";
import "./SourceCard.css";


export default function SourceCard({ id, value, version, description, status, picked = false, onClick1, onClick2, onClick3 }) {
    if (!picked) {
        picked = "sourceCard"
    } else {
        picked = "sourceCardPicked"
    }
    return (
        <>
            <div id={id} className={picked} onClick={onClick1}>
                {picked === "sourceCardPicked" && <>
                    <div className="sourceCardButtons">
                        <Button style={"sourcesCardDelete"} onClick={(e) => { e.stopPropagation(); onClick3(); }}>Удалить</Button>
                        <Button style={"sourcesCardClose"} onClick={(e) => { e.stopPropagation(); onClick2(); }}>Закрыть</Button>
                    </div>
                </>}
                <div className="sourceCardTop">
                    <p className="sourceCardValueFaded">Page ID: </p>{value}
                    <p className="sourceCardVersionFaded">Версия: </p>{version}
                </div>
                <div className="sourceCardMiddle">
                    <p className="sourceCardStatusFaded">Статус: </p>{status}
                </div>
                {picked === "sourceCardPicked" && <>
                    <div className="sourceCardMiddle">
                        <p className="sourceCardStatusFaded">Описание: </p>{description}
                    </div>
                </>}

            </div>
        </>
    )
}