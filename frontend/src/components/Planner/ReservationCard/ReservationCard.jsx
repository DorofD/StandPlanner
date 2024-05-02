import React, { Component } from "react";
import './ReservationCard.css'


export default function ReservationCard({reservation, currentUser}) {
    return (<>
            <li key={reservation.id}>  
                <div className="reservationCard">
                    <div className="reservationCardTop">
                       {reservation.login != currentUser && reservation.login || <b>{reservation.login}</b> } <p className="faded">зарезервировал</p> {reservation.name}
                    </div>
                    <div className="reservationCardBottom">
                    <div class="group">
                        <p className="faded"> Начало </p>{reservation.start_time}
                    </div>
                    <div class="group">
                        <p className="faded"> Длительность </p>{reservation.duration.slice(0, 2)}h {reservation.duration.slice(3, 5)}m 
                    </div>
                    <div class="group">
                        <p className="faded"> Статус</p> {reservation.status}
                    </div>
                    </div>
                </div>
            </li>
        </>
    )
}