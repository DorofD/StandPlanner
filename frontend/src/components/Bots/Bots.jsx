import React, { Component, useState } from "react";
import { NavLink as NavLinkBots, Outlet, useLocation } from "react-router-dom";
import "./Bots.css"
import Button from "../Button/Button";
import TimedMessages from "../TimedMessages/TimedMessages";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useColorScheme } from "../../contexts/ColorSchemeContext";
import ColorSchemeSelector from "../ColorSchemeSelector/ColorSchemeSelector";
export default function Bots() {
    const NavLink = React.forwardRef((props, ref) => {
        return (
            <NavLinkBots
                ref={ref}
                {...props}
            />
        );
    });
    return (
        <div className="botsMain">
            <div className="botsSection">
                <div className="logsFilterContainer1">
                </div>
                <div className="logsNotes1">
                    <div className="botsSidebar">
                        <nav className="botsSidebar">
                            <ul className="bots">
                                <li>
                                    <NavLink to="/" className={({ isActive }) => isActive ? 'activeBotsHref' : 'botsHref'}>
                                        Главная
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/planner" className={({ isActive }) => isActive ? 'activeBotsHref' : 'botsHref'}>
                                        Планировщик
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/admin" className={({ isActive }) => isActive ? 'activeBotsHref' : 'botsHref'}>
                                        Администрирование
                                    </NavLink>
                                </li>
                                <NavLink to="/about" className={({ isActive }) => isActive ? 'activeBotsHref' : 'botsHref'}>
                                    О приложении
                                </NavLink>
                            </ul>
                        </nav>
                    </div>
                    <div className="botsContent">
                        biba
                        <button></button>
                    </div>
                </div>
            </div>
            <div className="botsSection2"></div>
        </div>
    );
}