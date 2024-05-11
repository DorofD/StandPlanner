import React, { Component } from "react";
import "./Admin.css"
import { NavLink as NavLinkAdmin, Outlet } from "react-router-dom";

const NavLink = React.forwardRef((props, ref) => (
    <NavLinkAdmin
      ref={ref}
      {...props}
      className={props.activeClassName}
    />
  ));

export default function Admin() {
    return (
        <>
            <div className="admin-sidebar">
                <nav className="admin-sidebar">
                    <ul>
                        <li> <NavLink to="/admin/users" >Пользователи</NavLink></li>
                        <li> <NavLink to="/admin/bots" >Боты</NavLink></li>
                        <li> <NavLink to="/admin/logs" >Логи</NavLink></li>
                        <li> <NavLink to="/admin/apscheduler" >APScheduler</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <Outlet />
            </div>
        </>
    );
}