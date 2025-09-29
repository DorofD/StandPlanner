import React, { Component } from "react";
import "./RocketRoomCard.css";

export default function RocketRoomCard({ id, rid, name, fname, room_type, announcement, stand_uuid = false, onClick, picked = false }) {

    return (
        <>
            <div id={id} className={picked && "card rocketRoom picked" || "card rocketRoom"} onClick={onClick}>
                {picked &&
                    <div className="rocketRoomCardClose">
                        <button onClick={onClick}>Закрыть</button>
                    </div>}
                <div className="rocketRoomCardParams">
                    <div className="rocketRoomBottom">
                        <p className="rocketRoomCardValueFaded">name </p>
                        <div>{name}</div>
                    </div>
                    <div className="rocketRoomBottom">
                        <p className="rocketRoomCardValueFaded">room type</p>
                        <div>{room_type == 'p' && 'private' ||
                            room_type == 'c' && 'public' ||
                            room_type == 'd' && 'direct'
                        }</div>
                    </div>
                    {picked && <>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">rid </p>
                            <div>{rid}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">fname</p>
                            <div>{fname}</div>
                        </div>
                        <div className="rocketRoomBottom">
                            <p className="rocketRoomCardValueFaded">announcement</p>
                            <div className={picked && "roomLongContent picked" || "roomLongContent"}>{announcement}</div>
                        </div>
                    </>
                    }
                </div>
            </div>
        </>
    )
}