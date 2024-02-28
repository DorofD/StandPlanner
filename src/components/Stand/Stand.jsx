import React from "react";
import "./Stand.css"

export function Stand({ standName, standState, standOs}) {
    return (
        <>
        <div className="stand">
        {standName} {standState} {standOs}
        </div>
        
        </>
    )
}