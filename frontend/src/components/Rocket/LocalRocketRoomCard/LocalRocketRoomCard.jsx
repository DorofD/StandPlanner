import React, { Component } from "react";
import "./LocalRocketRoomCard.css";

export default function LocalRocketRoomCard({ id, rid, rocket_link, room_type, name, fname, stand_uuid, description, status, updated_at, onClick, onClick2, picked = true }) {

    return (
        <>
            <div id={id} className={picked && "card rocketRoom picked" || "card rocketRoom"} onClick={!picked && onClick}>
                {picked &&
                    <div className="rocketRoomCardClose">
                        <button onClick={onClick}>Закрыть</button>
                        <button onClick={onClick2}>Удалить</button>
                    </div>}
                <div className="rocketRoomCardParams">
                    <div className="rocketRoomBottom">
                        <p className="rocketRoomCardValueFaded">name </p>
                        <div className={!picked && "nowrapElipsis" || ""}>{name}</div>
                    </div>
                    <div className="rocketRoomBottom">
                        <p className="rocketRoomCardValueFaded">status </p>
                        <div className={status === "relevant" && "rocketRoomCardValueFaded paramValue success-colors" ||
                            status === "outdated" && "rocketRoomCardValueFaded paramValue warning-colors" ||
                            "rocketRoomCardValueFaded"}>{status}</div>
                    </div>
                    {picked && <>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">stand uuid </p>
                            <div>{stand_uuid}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">fname </p>
                            <div>{fname}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">updated at </p>
                            <div>{updated_at}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">room type</p>
                            <div>{room_type}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">rid </p>
                            <div>{rid}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">rocket link</p>
                            <div>{rocket_link}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">description</p>
                            <div className={picked && "roomLongContent picked" || "roomLongContent"}>{description}</div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </>
    )
}