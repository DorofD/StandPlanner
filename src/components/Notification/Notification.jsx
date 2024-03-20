import React, { Component } from "react";
import "./Notification.css";
import { useNotificationContext } from "../App";



export default function Notification ({notificationData1={message:'', type:''}}) {
    
    const {notificationData, notificationToggle} = useNotificationContext();
    console.log('notification data from Notification', notificationData)

    const message = notificationData['message']
    const type = notificationData['type']
    console.log(message)
    console.log(type)
    console.log( 'toggle from Notification', notificationToggle)
    if (!message) return (<></>);

    return (
      <div className={type} key={notificationToggle} >
        {message}
      </div>
    );
};