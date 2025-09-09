import React, { Component, useState, useEffect } from "react";
import "./Base.css";
import { NavLink as NavLinkBase, Outlet, useLocation } from "react-router-dom";
import Button from "../Button/Button";
import TimedMessages from "../TimedMessages/TimedMessages";
import { useTimedMessagesContext } from "../../hooks/useTimedMessagesContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useSidebarState } from "../../hooks/useSidebarStateContext";
import ColorSchemeSelector from "../ColorSchemeSelector/ColorSchemeSelector";
import HomeIcon from "../../svg_images/Home.svg"
import ScheduleIcon from "../../svg_images/Schedule.svg"
import GearIcon from "../../svg_images/Gear.svg"
import ManualIcon from "../../svg_images/Manual.svg"
import ExpandRightIcon from "../../svg_images/ExpandRight.svg"
import ExpandLeftIcon from "../../svg_images/ExpandLeft.svg"
import LogoutIcon from "../../svg_images/Logout.svg"
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
    const { messages, addMesage } = useTimedMessagesContext();
    const { sidebarCollapsed, setSidebarCollapsed } = useSidebarState();
    const location = useLocation();
    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 992px)');

        const handleMediaChange = (e) => {
            if (!e.matches) {
                localStorage.setItem("sidebar-state", 'collapsed')
                setSidebarCollapsed(true)
            }

        };

        handleMediaChange(mediaQuery);

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    return (
        <>
            <div className="baseHeader" id="modal-root">
                <ColorSchemeSelector></ColorSchemeSelector>
                <div className="baseUserName">{userName}</div>
                <div className="baseLogoutIconContainer" onClick={toogleAuth}><LogoutIcon className='baseLogoutIconStyle '></LogoutIcon></div>

            </div>
            <div className="baseBody">
                <div className={!sidebarCollapsed && "baseSidebar" || "baseSidebar collapsed"}>
                    <TimedMessages data={messages} />
                    <nav className={!sidebarCollapsed && "baseSidebar" || "baseSidebar collapsed"}>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'baseHref active' : 'baseHref'}>
                            {!sidebarCollapsed &&
                                <div className="baseHrefText">Главная</div>
                                ||
                                <HomeIcon className="baseSidebarIcon"></HomeIcon>} {sidebarCollapsed && <div className="baseSidebarTextDiv">Главная</div>}
                        </NavLink>
                        <NavLink to="/planner" className={({ isActive }) => isActive ? 'baseHref active' : 'baseHref'} aria-current="page">
                            {!sidebarCollapsed &&
                                <div className="baseHrefText">Планировщик</div>
                                ||
                                <ScheduleIcon className="baseSidebarIcon"></ScheduleIcon>} {sidebarCollapsed && <div className="baseSidebarTextDiv">Резервирование</div>}
                            {/* <span className="BHtooltip">Открыть ссылку в новом окне</span> */}
                        </NavLink>
                        {userRole === 'admin' && (<>
                            <NavLink to="/admin" className={({ isActive }) => isActive ? 'baseHref active' : 'baseHref'}>
                                {!sidebarCollapsed &&
                                    <div className="baseHrefText">Администрирование</div>
                                    ||
                                    <GearIcon className="baseSidebarIcon"></GearIcon>} {sidebarCollapsed && <div className="baseSidebarTextDiv">Администрирование</div>}
                            </NavLink>
                        </>)}
                        <NavLink to="/about" className={({ isActive }) => isActive ? 'baseHref active' : 'baseHref'}>
                            {!sidebarCollapsed &&
                                <div className="baseHrefText">О приложении</div>
                                ||
                                <ManualIcon className="baseSidebarIcon"></ManualIcon>} {sidebarCollapsed && <div className="baseSidebarTextDiv">О приложении</div>}
                        </NavLink>
                    </nav>
                    {!sidebarCollapsed &&
                        <div className="baseSidebarExpandContainer" onClick={() => { localStorage.setItem("sidebar-state", 'collapsed'); setSidebarCollapsed(true) }}>
                            <ExpandLeftIcon className="baseSidebarExpandIcon" ></ExpandLeftIcon>
                        </div>
                        ||
                        <div className="baseSidebarExpandContainer" onClick={() => { localStorage.setItem("sidebar-state", 'default'); setSidebarCollapsed(false) }}>
                            <ExpandRightIcon className="baseSidebarExpandIcon" ></ExpandRightIcon>
                        </div>
                    }
                </div>
                <div className={!sidebarCollapsed && "baseContent" || "baseContent collapsed"}>
                    <Outlet />
                </div>
            </div>
        </>
    );
}
