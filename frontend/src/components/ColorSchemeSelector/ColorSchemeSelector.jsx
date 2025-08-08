import React, { useEffect, useState } from "react";
import "./ColorSchemeSelector.css"
import { useColorScheme } from "../../hooks/useColorThemeContext";

export default function ColorSchemeSelector() {
    const { colorSchemeNumber, setColorSchemeNumber } = useColorScheme();
    const { colorScheme, setColorScheme } = useColorScheme();
    const [localSchemeNumber, setLocalSchemeNumber] = useState()

    const mainScheme = {
        accent: "#4CAF50",
        hover: "#6e8399e3",
        navbar: "#f1f1f1",
        mainBackground: "#ffffff",
        reject: "#F44336",
        warning: "#FFC107",
        info: "#2196F3",
        textMain: "#000000",
        textSecondary: "#6e8399",
        disabled: "#b0b6b8"
    }

    const darkColorScheme = {
        accent: "#aa3213",
        hover: "#e06d50",
        navbar: "#23272F",
        mainBackground: "#181A20",
        reject: "#B55454",
        warning: "#E2B86B",
        info: "#4C80CF",
        textMain: "#F3F3F3",
        textSecondary: "#A0A4AD",
        disabled: "#444950"
    };

    const softLightColorScheme = {
        accent: "#FFB74D",
        hover: "#dbe4ee",
        navbar: "#f7f9fa",
        mainBackground: "#f5f6fa",
        reject: "#E57373",
        warning: "#FFD580",
        info: "#64A6FF",
        textMain: "#23272F",
        textSecondary: "#7a869a",
        disabled: "#cfd8dc"
    };

    useEffect(() => {
        const saved = localStorage.getItem("colorSchemeNumber");
        if (saved) setLocalSchemeNumber(saved);
    }, []);

    return (
        <div className="colorSchemeIcons">
            {/* <div className={colorSchemeNumber == 'schema1' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema1'); setColorScheme(mainScheme) }} ></div>
            <div className={colorSchemeNumber == 'schema2' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema2'); setColorScheme(darkColorScheme) }} ></div>
            <div className={colorSchemeNumber == 'schema3' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema3'); setColorScheme(softLightColorScheme) }} ></div> */}
            {/* <div className={colorSchemeNumber == 'schema1' && "colorCircle active" || "colorCircle"} onClick={() => setColorSchemeNumber('schema1')} ></div>
            <div className={colorSchemeNumber == 'schema2' && "colorCircle active" || "colorCircle"} onClick={() => setColorSchemeNumber('schema2')} ></div>
            <div className={colorSchemeNumber == 'schema3' && "colorCircle active" || "colorCircle"} onClick={() => setColorSchemeNumber('schema3')} ></div> */}
            <div className={localSchemeNumber == 'schema1' && "colorCircle active" || "colorCircle"} onClick={() => { setColorScheme(mainScheme); localStorage.setItem("colorSchemeNumber", 'schema1'); setLocalSchemeNumber('schema1') }} ></div>
            <div className={localSchemeNumber == 'schema2' && "colorCircle active" || "colorCircle"} onClick={() => { setColorScheme(darkColorScheme); localStorage.setItem("colorSchemeNumber", 'schema2'); setLocalSchemeNumber('schema2') }} ></div>
            <div className={localSchemeNumber == 'schema3' && "colorCircle active" || "colorCircle"} onClick={() => { setColorScheme(softLightColorScheme); localStorage.setItem("colorSchemeNumber", 'schema3'); setLocalSchemeNumber('schema3') }} ></div>
        </div>
    );
}