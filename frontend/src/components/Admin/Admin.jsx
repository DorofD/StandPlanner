import React, { Component } from "react";
import "./Admin.css"
import { NavLink as NavLinkAdmin, Outlet } from "react-router-dom";

const NavLink = React.forwardRef((props, ref) => {
    return (
        <NavLinkAdmin
            ref={ref}
            {...props}
            className={({ isActive }) =>
                isActive ? 'activeAdminHref' : 'adminHref'
            }
        />
    );
});

export default function Admin() {
    return (
        <>
            <div className="admin-sidebar">
                <nav className="admin-sidebar">
                    <ul className="admin">
                        <li className="admin"> <NavLink to="/admin/users" >Пользователи</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/bots" >Боты</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/logs" >Логи</NavLink></li>
                        <li className="admin"> <NavLink to="/admin/apscheduler" >APScheduler</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </>
    );
}