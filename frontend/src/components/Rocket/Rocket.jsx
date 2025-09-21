import React, { Component, useState } from "react";
import "./Rocket.css"
import TimedMessages from "../TimedMessages/TimedMessages";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
export default function Rocket() {
    return (
        <div className="rocketMain">
            <div className="rocketLeft">
                <div className="rocketLeft1">
                    Управление взаимодействием с Rocket.Chat
                </div>

            </div>
            <div className="rocketRight">
                биба
            </div>
        </div>
    );
}