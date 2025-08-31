import React, { Component, useState } from "react";
import "./Bots.css"
import Button from "../Button/Button";
import TimedMessages from "../TimedMessages/TimedMessages";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
export default function Bots() {
    return (
        <div className="botsMain">
            <div className="botsSection">
                <div className="logsFilterContainer1">
                </div>
                <div className="logsNotes1">

                </div>
            </div>
            <div className="botsSection2"></div>
        </div>
    );
}