import React, { Component } from "react";
import "./StandCard.css";
import WarningIcon from "../../../svg_images/WarningIcon.svg"

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

                        {status === "Free" && <div className={"paramValue success-colors"}>Свободен</div> ||
                            status === "Busy" && <div className={"paramValue info-colors"}>Занят</div> ||
                            status === "Unknown" && <div className={"paramValue warning-colors"}>Неизвестен</div> ||
                            status === "Maintenance" && <div className={"paramValue info-colors"}>Занят</div>}

                    </div>
                </div>
                {errorWarning === true && <div className="standCardParamValue2 ">
                    <WarningIcon className="standCardWarningIcon" />
                </div>}
            </div>
        </>
    )
}