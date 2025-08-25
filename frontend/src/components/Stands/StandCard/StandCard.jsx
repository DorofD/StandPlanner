import React, { Component } from "react";
import "./StandCard.css";
import WarningIcon from "./WarningIcon.svg"

export default function StandCard({ id, name, source_type, status, onClick, picked = false, errorWarning = false }) {

    return (
        <>
            <div id={id} className={picked && "card stand picked" || "card stand"} onClick={onClick}>
                <div className="standCardParams">

                    <div className="standCardHeader">
                        <p className="standCardName">{name}</p>
                    </div>
                    <div className="standCardBottom">
                        <p className="standCardValueFaded">Статус: </p>

                        {status === "free" && <div className={"paramValue success-colors"}>Свободен</div> ||
                            status === "busy" && <div className={"paramValue info-colors"}>Занят</div> ||
                            status === "unknown" && <div className={"paramValue warning-colors"}>Неизвестен</div> ||
                            status === "maintenance" && <div className={"paramValue info-colors"}>Занят</div>}

                    </div>
                </div>
                {errorWarning === true && <div className="standCardParamValue2 ">
                    <WarningIcon className="standCardWarningIcon" />
                </div>}
            </div>
        </>
    )
}