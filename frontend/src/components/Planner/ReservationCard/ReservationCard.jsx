import React, { Component } from "react";
import './ReservationCard.css'
import editLogo from './edit.png'

export default function ReservationCard({reservation, currentUser, onClick}) {
    let canPick
    if (reservation.login == currentUser) {
        canPick = true 
    } else {
        canPick = false
    }
    return (<>
            <li id={reservation.id} onClick={onClick}>  
                <div className={!canPick && "reservationCard" || "reservationCard canPick"}>
                    <div className="reservationCardTop">
                       {reservation.login != currentUser && reservation.login || <b>{reservation.login}</b> } <p className="faded">зарезервировал</p> {reservation.name}
                    </div>
                    <div className="reservationCardBottom">
                    <div className="group">
                        <p className="faded"> Начало </p>{reservation.start_time}
                    </div>
                    <div className="group">
                        <p className="faded"> Длительность </p>{reservation.duration.slice(0, 2)}h {reservation.duration.slice(3, 5)}m 
                    </div>
                    <div className="group">
                        <p className="faded"> Статус</p> {reservation.status}
                    </div>
                    </div> 
                    <div className="editLogo">
                        {canPick && <img src={editLogo} alt="" className="editLogo"/>}
                    </div>
                </div>
            </li>
        </>
    )
}