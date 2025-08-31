import React, { useEffect, useState } from "react";
import "./ColorSchemeSelector.css"
import { useColorScheme } from "../../hooks/useColorThemeContext";
import MoonIcon from "../../svg_images/Moon.svg"
import SunIcon from "../../svg_images/Sun.svg"

export default function ColorSchemeSelector() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const [isSchemesOpen, setIsSchemesOpen] = useState(false);

    return (
        <div className="colorSchemeMain" >
            <div className="colorSchemeIcons">
                {colorScheme == 'default' &&
                    <MoonIcon className="colorSchemeIconStyle" onClick={() => {
                        setColorScheme('dark-red');
                        localStorage.setItem("colorScheme", 'dark-red')
                    }} />
                }
                {colorScheme == 'dark-red' &&
                    <SunIcon className="colorSchemeIconStyle" onClick={() => {
                        setColorScheme('default');
                        localStorage.setItem("colorScheme", 'default')
                    }} />
                }
            </div>

            {/* <div className={isSchemesOpen && "right-arrow" || "left-arrow"} onClick={() => { setIsSchemesOpen(prev => !prev); console.log(isSchemesOpen) }}></div>
            <div className={isSchemesOpen && "colorSchemeIcons" || "colorSchemeIcons disabled"}>
                <div className={colorScheme == 'default' && "colorCircle light-green active" || "colorCircle light-green"}
                    onClick={() => {
                        setColorScheme('default');
                        localStorage.setItem("colorScheme", 'default')
                    }} ></div>
                <div className={colorScheme == 'dark-red' && "colorCircle dark-red active" || "colorCircle dark-red"}
                    onClick={() => {
                        setColorScheme('dark-red');
                        localStorage.setItem("colorScheme", 'dark-red')
                    }} ></div>

            </div> */}
        </div>

    );
}

