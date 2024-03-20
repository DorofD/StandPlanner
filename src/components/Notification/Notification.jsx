import React, { Component } from "react";
import "./Notification.css";

export default function Notification ({notificationData={message:'', type:''}}) {
   
    console.log('notification data from Notification', notificationData)

    console.log(1)
    const message = notificationData['message']
    console.log(2)
    const type = notificationData['type']
    console.log(3)

    if (!message) return (<></>);

    return (
      <div className={type} >
        {message}
      </div>
    );
};