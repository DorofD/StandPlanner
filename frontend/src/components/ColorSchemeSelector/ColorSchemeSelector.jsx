import React, { useEffect, useState } from "react";
import "./ColorSchemeSelector.css"
import { useColorScheme } from "../../hooks/useColorThemeContext";
// import NightSkyIcon from './NightSky.svg'
// import MoonToSunnyOutlineLoopTransition from "./MoonToSunnyOutlineLoopTransition.jsx"

export default function ColorSchemeSelector() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const [isSchemesOpen, setIsSchemesOpen] = useState(false);

    return (
        <div className="colorSchemeMain" >
            <div className="box">
                MoonTo
            </div>
            {/* <NightSkyIcon className="colorSchemeNightSky" ></NightSkyIcon>
            <MoonToSunnyOutlineLoopTransition className="colorSchemeNightSky"></MoonToSunnyOutlineLoopTransition> */}
            {/* <div className={isSchemesOpen && "right-arrow" || "left-arrow"} onClick={() => { setIsSchemesOpen(prev => !prev); console.log(isSchemesOpen) }}></div>
            <div className={isSchemesOpen && "colorSchemeIcons" || "colorSchemeIcons disabled"}> */}
            <div className={colorScheme == 'http' && "colorCircle light-green active" || "colorCircle light-green"}
                onClick={() => {
                    setColorScheme('http');
                    localStorage.setItem("colorScheme", 'http')
                }} ></div>
            <div className={colorScheme == 'dark-red' && "colorCircle dark-red active" || "colorCircle dark-red"}
                onClick={() => {
                    setColorScheme('dark-red');
                    localStorage.setItem("colorScheme", 'dark-red')
                }} ></div>


            {/* <div className={colorScheme == 'dark-purple' && "colorCircle dark-purple active" || "colorCircle dark-purple"}
                    onClick={() => {
                        setColorScheme('dark-purple');
                        localStorage.setItem("colorScheme", 'dark-purple')
                    }} ></div> */}

        </div>

    );
}

