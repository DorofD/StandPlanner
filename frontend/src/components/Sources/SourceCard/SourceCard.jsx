import React, { Component } from "react";
import Button from "../../Button/Button";
import "./SourceCard.css";


export default function SourceCard({ id, value, version, description, status, picked = false, last_update, onClick1, onClick2, onClick3, onClick4 }) {

    return (
        <>
            <div id={id} className={!picked && "card source" || "card source picked"} onClick={onClick1}>
                {picked && <>
                    <div className="sourceCardButtons header">
                        <Button style={"standartNeutral"} onClick={(e) => { e.stopPropagation(); onClick4(); }}>Обновить данные</Button>
                        <Button style={"standartNeutral"} onClick={(e) => { e.stopPropagation(); onClick2(); }}>Закрыть</Button>
                    </div>
                </>}
                <div className="sourceCardTop">
                    <p className="sourceCardValueFaded">Page ID: </p>{value}
                    <p className="sourceCardStatusFaded">Статус: </p>{status}
                </div>
                <div className="sourceCardMiddle">
                    <p className="sourceCardUpdateFaded">Последнее обновление: </p>{last_update}
                </div>
                {picked && <>
                    <div className="sourceCardMiddle">
                        <p className="sourceCardVersionFaded">Версия: </p>{version}
                    </div>
                    <div className="sourceCardMiddle">
                        <p className="sourceCardVersionFaded">Описание: </p>{description}
                    </div>
                    <div className="sourceCardButtons">
                        <button onClick={(e) => { e.stopPropagation(); onClick3(); }}>Удалить</button>
                    </div>
                </>}

            </div>
        </>
    )
}