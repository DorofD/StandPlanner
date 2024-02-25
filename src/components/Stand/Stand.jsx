import React from "react";

export function Stand({ standName, standState, standOs}) {
    return (
        <>
        {standName} {standState} {standOs}
        <br />
        </>
    )
}