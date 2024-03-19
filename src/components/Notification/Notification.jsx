import React, {useState, Component } from "react";
import "./Notification.css";

function Notification ({message, style}) {
    
    if (!message) return null;
  return (
    <div className={style} >
      {message}
    </div>
  );
};

export default function useNotification () {

    const [notification, setNotification] = useState(null);

    const showNotification = (message, style) => {
        console.log(1)
        const notificationComponent = (
            <Notification message={message} style={style} />
        );
        setNotification(notificationComponent);
        setTimeout(() => setNotification(null), 3000);
    };

    return { notificationComponent: notification, showNotification };
};