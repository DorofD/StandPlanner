import React, { Component } from "react";
import "./Admin.css"
import { NavLink as NavLinkAdmin, Outlet } from "react-router-dom";

import { useColorScheme } from "../../hooks/useColorThemeContext";
import { useSidebarState } from "../../hooks/useSidebarStateContext";

import UsersGearIcon from "../../svg_images/UsersGear.svg"
import ConfluenceIcon from "../../svg_images/Confluence.svg"
import BareMetalIcon from "../../svg_images/BareMetal.svg"
import BotIcon from "../../svg_images/Bot.svg"
import CatalogIcon from "../../svg_images/Catalog.svg"
import PythonGearIcon from "../../svg_images/PythonGear.svg"

import img1 from "./easter_imgs/img1.webp"
import img2 from "./easter_imgs/img2.webp"
import img3 from "./easter_imgs/img3.webp"
import img4 from "./easter_imgs/img4.webp"
import img5 from "./easter_imgs/img5.webp"
import img6 from "./easter_imgs/img6.webp"
import img7 from "./easter_imgs/img7.webp"
import img8 from "./easter_imgs/img8.webp"
import img9 from "./easter_imgs/img9.webp"
import img10 from "./easter_imgs/img10.webp"

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

    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10];
    function getRandomImage(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }
    const randomImage = getRandomImage(images);
    return (
        <>
            {/* <div className={!sidebarCollapsed && "admin-sidebar" || "admin-sidebar collapsed"}>
                <nav className="admin-sidebar">
                    <ul className="admin">
                        <li className="admin"> <NavLink to="/admin/users" >Пользователи</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/sources" >Источники</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/stands" >Стенды</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/bots" >Боты</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/logs" >Логи</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/apscheduler" >APScheduler</NavLink></li>
                    </ul>
                </nav>
                {colorScheme == 'dark-red' && !sidebarCollapsed &&
                    <img className="randomImage" src={randomImage} alt="" />}
            </div>
            <div className={!sidebarCollapsed && "admin-content" || "admin-content collapsed"}>
                <Outlet />
            </div> */}
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
                    <NavLink to="/admin/bots" >
                        {!sidebarCollapsed &&
                            <div className="baseHrefText">Боты</div>
                            ||
                            <BotIcon className="baseSidebarIcon"></BotIcon>}
                        {sidebarCollapsed && <div className="baseSidebarTextDiv">Боты</div>}
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

                </nav>
            </div>
            <div className={!sidebarCollapsed && "baseContent" || "baseContent collapsed"}>
                <Outlet />
            </div>
        </>
    );
}