import React, { Component } from "react";
import "./Admin.css"
import { NavLink as NavLinkAdmin, Outlet } from "react-router-dom";

import { useColorScheme } from "../../hooks/useColorThemeContext";
import { useSidebarState } from "../../hooks/useSidebarStateContext";

import UsersGearIcon from "../../svg_images/UsersGear.svg"
import ConfluenceIcon from "../../svg_images/Confluence.svg"
import BareMetalIcon from "../../svg_images/BareMetal.svg"
import CatalogIcon from "../../svg_images/Catalog.svg"
import PythonGearIcon from "../../svg_images/PythonGear.svg"
import RocketChatIcon from "../../svg_images/RocketChat.svg"

const NavLink = React.forwardRef((props, ref) => {
    return (
        <NavLinkAdmin
            ref={ref}
            {...props}
            className={({ isActive }) =>
                // isActive ? 'activeAdminHref' : 'adminHref'
                isActive ? 'baseHref active' : 'baseHref'
            }
        />
    );
});

export default function Admin() {
    const { colorScheme } = useColorScheme();
    const { sidebarCollapsed } = useSidebarState();

    return (
        <>
            <div className={!sidebarCollapsed && "baseSidebar" || "baseSidebar collapsed"}>
                <nav className={!sidebarCollapsed && "baseSidebar" || "baseSidebar collapsed"}>
                    <NavLink to="/admin/users" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Пользователи</div>
                            ||
                            <UsersGearIcon className="baseSidebarIcon"></UsersGearIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Пользователи</div>}
                    </NavLink>
                    <NavLink to="/admin/sources" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Источники</div>
                            ||
                            <ConfluenceIcon className="baseSidebarIcon"></ConfluenceIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Источники данных</div>}
                    </NavLink>
                    <NavLink to="/admin/stands" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Стенды</div>
                            ||
                            <BareMetalIcon className="baseSidebarIcon"></BareMetalIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Стенды</div>}
                    </NavLink>
                    <NavLink to="/admin/rocket" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Rocket.Chat</div>
                            ||
                            <RocketChatIcon className="baseSidebarIcon"></RocketChatIcon>}
                        {/* <BotIcon className="baseSidebarIcon"></BotIcon>} */}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Rocket.Chat</div>}
                    </NavLink>
                    <NavLink to="/admin/logs" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Логи</div>
                            ||
                            <CatalogIcon className="baseSidebarIcon"></CatalogIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Логи</div>}
                    </NavLink>
                    <NavLink to="/admin/apscheduler" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">APScheduler</div>
                            ||
                            <PythonGearIcon className="baseSidebarIcon"></PythonGearIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">APScheduler</div>}
                    </NavLink>
                    {/* {colorScheme == 'dark-red' && !sidebarCollapsed &&
                        <img className="randomImage" src={randomImage} alt="" />} */}
                </nav>
            </div>
            <div className={!sidebarCollapsed && "baseContent" || "baseContent collapsed"}>
                <Outlet />
            </div>
        </>
    );
}