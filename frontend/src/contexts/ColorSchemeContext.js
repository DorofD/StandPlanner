import React, { createContext, useState, useEffect, useContext } from "react";

export const ColorSchemeContext = createContext();

export const ColorSchemeProvider = ({ children }) => {

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

    const getInitialScheme = () => {
        const saved = localStorage.getItem("colorSchemeNumber") || "schema1";
        if (saved === "schema1") return mainScheme;
        if (saved === "schema2") return darkColorScheme;
        if (saved === "schema3") return softLightColorScheme;
        return mainScheme;
    };

    const [colorScheme, setColorScheme] = useState(getInitialScheme);
    // const [colorSchemeNumber, setColorSchemeNumber] = useState(getInitialSchemeNumber);

    const [colorSchemeNumber, setColorSchemeNumber] = useState()
    // const [colorScheme, setColorScheme] = useState({
    //     accent: "#4CAF50",
    //     hover: "#6e8399e3",
    //     navbar: "#f1f1f1",
    //     mainBackground: "#ffffff",
    //     reject: "#F44336",
    //     warning: "#FFC107",
    //     info: "#2196F3",
    //     textMain: "#000000",
    //     textSecondary: "#6e8399",
    //     disabled: "#b0b6b8"
    // });



    // useEffect(() => {
    //     console.log('use effect 1')
    //     const saved = localStorage.getItem("colorSchemeNumber");
    //     if (saved) setColorSchemeNumber(saved);
    //     console.log(saved)
    //     { colorSchemeNumber === 'schema1' || setColorScheme(mainScheme) };
    //     { colorSchemeNumber === 'schema2' || setColorScheme(darkColorScheme) };
    //     { colorSchemeNumber === 'schema3' || setColorScheme(softLightColorScheme) };
    // }, []);


    useEffect(() => {
        console.log('use effect 2')
        console.log('setting colors')
        // const saved = localStorage.getItem("colorSchemeNumber");
        // if (saved) setColorSchemeNumber(saved);
        document.documentElement.style.setProperty('--accent-color', colorScheme.accent);
        document.documentElement.style.setProperty('--hover-color', colorScheme.hover);
        document.documentElement.style.setProperty('--navbar-color', colorScheme.navbar);
        document.documentElement.style.setProperty('--main-background-color', colorScheme.mainBackground);
        document.documentElement.style.setProperty('--reject-color', colorScheme.reject);
        document.documentElement.style.setProperty('--warning-color', colorScheme.warning);
        document.documentElement.style.setProperty('--info-color', colorScheme.info);
        document.documentElement.style.setProperty('--text-main-color', colorScheme.textMain);
        document.documentElement.style.setProperty('--text-secondary-color', colorScheme.textSecondary);
        document.documentElement.style.setProperty('--disabled-color', colorScheme.disabled);
        { colorSchemeNumber }
        // localStorage.setItem("colorSchemeNumber", colorSchemeNumber);
    }, [colorScheme]);

    return (
        <ColorSchemeContext.Provider value={{ colorSchemeNumber, colorScheme, setColorSchemeNumber, setColorScheme }}>
            {children}
        </ColorSchemeContext.Provider>
    );
}



// import React, { createContext, useState, useEffect, useContext } from "react";

// const AccentColorContext = createContext();

// export function AccentColorProvider({ children }) {
//     const [accentColor, setColorScheme] = useState("#4CAF50");

//     useEffect(() => {
//         const saved1 = localStorage.getItem("accentColor");
//         if (saved1) setColorScheme(saved1);
//     }, []);

//     useEffect(() => {
//         document.documentElement.style.setProperty('--accent-color', accentColor);
//         localStorage.setItem("accentColor", accentColor);
//     }, [accentColor], [hooverColor]);

//     return (
//         <AccentColorContext.Provider value={{ accentColor, hooverColor, setColorScheme, setHooverColor }}>
//             {children}
//         </AccentColorContext.Provider>
//     );
// }

// export function useAccentColor() {
//     return useContext(AccentColorContext);
// }

