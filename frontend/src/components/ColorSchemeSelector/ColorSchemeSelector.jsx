import React, { useEffect, useState } from "react";
import "./ColorSchemeSelector.css"
import { useColorScheme } from "../../hooks/useColorThemeContext";

export default function ColorSchemeSelector() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const [isSchemesOpen, setIsSchemesOpen] = useState(false);

    return (
        <div className="colorSchemeMain" >
            <div className="box"></div>
            <div className={isSchemesOpen && "right-arrow" || "left-arrow"} onClick={() => { setIsSchemesOpen(prev => !prev); console.log(isSchemesOpen) }}></div>
            <div className={isSchemesOpen && "colorSchemeIcons" || "colorSchemeIcons disabled"}>
                <div className={colorScheme == 'http' && "colorCircle light-green active" || "colorCircle light-green"}
                    onClick={() => {
                        setColorScheme('http');
                        localStorage.setItem("colorScheme", 'http')
                    }} ></div>
                {/* <div className={colorScheme == 'light-orange' && "colorCircle light-orange active" || "colorCircle light-orange"}
                    onClick={() => {
                        setColorScheme('light-orange');
                        localStorage.setItem("colorScheme", 'light-orange')
                    }} ></div> */}
                <div className={colorScheme == 'dark-purple' && "colorCircle dark-purple active" || "colorCircle dark-purple"}
                    onClick={() => {
                        setColorScheme('dark-purple');
                        localStorage.setItem("colorScheme", 'dark-purple')
                    }} ></div>
                {/* <div className={colorScheme == 'black-yellow' && "colorCircle black-yellow active" || "colorCircle black-yellow"}
                    onClick={() => {
                        setColorScheme('black-yellow');
                        localStorage.setItem("colorScheme", 'black-yellow')
                    }} ></div> */}
            </div>
        </div >
    );
}

