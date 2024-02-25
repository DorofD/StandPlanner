import React from "react";

export function Button({ text }) {
    function handleClick() {
        console.log('button ' + text + ' clicked')
    }

    return <button onClick={handleClick}>{text}</button>
}