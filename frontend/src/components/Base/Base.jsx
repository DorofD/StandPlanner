import React, { Component, useState, useEffect } from "react";
import "./Base.css";
import { NavLink as NavLinkBase, Outlet, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import TimedMessages from "../TimedMessages/TimedMessages";
// // import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useColorScheme } from "../../hooks/useColorThemeContext";
import ColorSchemeSelector from "../ColorSchemeSelector/ColorSchemeSelector";
import img1 from "./img1.webp"
import img2 from "./img2.webp"
import img3 from "./img3.webp"
import img4 from "./img4.webp"
import img5 from "./img5.webp"
import img6 from "./img6.webp"
import img7 from "./img7.webp"
import img8 from "./img8.webp"
import img9 from "./img9.webp"
import img10 from "./img10.webp"
const NavLink = React.forwardRef((props, ref) => {
    return (
        <NavLinkBase
            ref={ref}
            {...props}
        />
    );
});


export default function Base() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }
    const randomImage = getRandomImage(images);

    const { isAuthenticated, toogleAuth } = useAuthContext();
    const { userName, userRole, accessToken } = useAuthContext();
    // const { notificationData } = useNotificationContext();
    const { messages, addMesage } = useTimedMessagesContext();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            <div className="baseHeader" id="modal-root">
                <button onClick={() => setCollapsed((prev) => !prev)}></button>
                <ColorSchemeSelector></ColorSchemeSelector>
                <div className="baseUserName">{userName}</div>
                <Button style={"logout"} type={"submit"} onClick={toogleAuth}> Выйти </Button>
            </div>
            <div className="baseBody">
                <div className={!collapsed && "baseSidebar" || "baseSidebar collapsed"}>
                    <nav className="baseSidebar">

                        {/* <Notification data={notificationData} /> */}
                        <TimedMessages data={messages} />
                        <ul className="base">
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? 'activeBaseHref' : 'baseHref'}>
                                    Главная
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/planner" className={({ isActive }) => isActive ? 'activeBaseHref' : 'baseHref'}>
                                    Планировщик
                                </NavLink>
                            </li>
                            {userRole === 'admin' && (<>
                                <li>
                                    <NavLink to="/admin" className={({ isActive }) => isActive ? 'activeBaseHref' : 'baseHref'}>
                                        Администрирование
                                    </NavLink>
                                </li>
                            </>)}
                            <NavLink to="/about" className={({ isActive }) => isActive ? 'activeBaseHref' : 'baseHref'}>
                                О приложении
                            </NavLink>
                        </ul>

                    </nav>
                    {colorScheme == 'dark-red' &&
                        <img className="randomImage" src={randomImage} alt="Random" />}
                </div>
                <div className="baseContent">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
