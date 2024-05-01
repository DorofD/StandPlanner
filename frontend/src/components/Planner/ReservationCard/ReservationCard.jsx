import React, { Component } from "react";
import './ReservationCard.css'


export default function ReservationCard({reservation, currentUser}) {
    console.log(reservation.login)
    console.log(currentUser)
    return (<>
            <div className="reservationCard">
                        <li key={reservation.id}> Пользователь {reservation.login != currentUser && reservation.login || <b>{reservation.login}</b> } | Стенд {reservation.name} | Время начала {reservation.start_time} | Длительность {reservation.duration} | Статус {reservation.status} </li>
            </div>
        </>
    )
}