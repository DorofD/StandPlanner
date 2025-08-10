import React, { Component, useState, useEffect } from "react";
import "./Base.css";
import { NavLink as NavLinkBase, Outlet, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import Notification from "../Notification/Notification";
import { useNotificationContext } from "../../hooks/useNotificationContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useColorScheme } from "../../contexts/ColorSchemeContext";
import ColorSchemeSelector from "../ColorSchemeSelector/ColorSchemeSelector";

const NavLink = React.forwardRef((props, ref) => {
    return (
        <NavLinkBase
            ref={ref}
            {...props}
        />
    );
});


export default function Base() {
    const { isAuthenticated, toogleAuth } = useAuthContext();
    const { userName, userRole, accessToken } = useAuthContext();
    const { notificationData } = useNotificationContext();
    const location = useLocation();


    return (
        <>
            <div className="baseHeader" id="modal-root">
                <ColorSchemeSelector></ColorSchemeSelector>
                <div className="baseUserName">{userName}</div>
                <Button style={"logout"} type={"submit"} onClick={toogleAuth}> Выйти </Button>
            </div>
            <div className="baseBody">
                <div className="baseSidebar">
                    <nav className="baseSidebar">
                        <Notification data={notificationData} />
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
                </div>
                <div className="baseContent">
                    <Outlet />
                </div>
            </div>
        </>
    );
}
