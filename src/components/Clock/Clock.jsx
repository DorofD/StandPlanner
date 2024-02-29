import React from "react";
import { useState } from "react";
import "./Clock.css";


export default function Clock() {

    const [now, setNow] = useState(new Date())

    setInterval(() => setNow(new Date()), 1000)

    return (
        <>
            <div className="clock">
                <span className="clock">{now.toLocaleTimeString()}</span>
            </div>
        </>
    );
}
