import React from "react";
import "./ColorSchemeSelector.css"
import { useColorScheme } from "../../contexts/ColorSchemeContext";

export default function ColorSchemeSelector() {
    const { colorSchemeNumber, setColorSchemeNumber } = useColorScheme();
    const { colorScheme, setColorScheme } = useColorScheme();
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
        accent: "#FFB74D",   // Мягкий зелёный
        hover: "#dbe4ee",   // Светло-серый с голубым оттенком
        navbar: "#f7f9fa",   // Очень светлый серо-голубой
        mainBackground: "#f5f6fa", // Ещё более светлый фон
        reject: "#E57373",   // Приглушённый красный
        warning: "#FFD580",   // Светлый жёлтый/янтарный
        info: "#64A6FF",   // Нежно-голубой
        textMain: "#23272F",   // Очень тёмно-серый (почти чёрный)
        textSecondary: "#7a869a", // Серо-голубой для второстепенного текста
        disabled: "#cfd8dc"    // Светло-серый для неактивных элементов
    };
    return (
        <div className="colorSchemeIcons">
            <div className={colorSchemeNumber == 'schema1' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema1'); setColorScheme(mainScheme) }} ></div>
            <div className={colorSchemeNumber == 'schema2' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema2'); setColorScheme(darkColorScheme) }} ></div>
            <div className={colorSchemeNumber == 'schema3' && "colorCircle active" || "colorCircle"} onClick={() => { setColorSchemeNumber('schema3'); setColorScheme(softLightColorScheme) }} ></div>
        </div>
    );
}