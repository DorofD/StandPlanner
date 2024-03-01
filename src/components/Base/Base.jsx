import React, { Component } from "react";
import "./Base.css";
import { NavLink as NavLinkBase, Outlet, Link } from "react-router-dom";


const NavLink = React.forwardRef((props, ref) => (
  <NavLinkBase
    ref={ref}
    {...props}
    className={props.activeClassName}
  />
));


function Base() {
    return (
        <>
            <div className="sidebar">
                <nav className="sidebar">
                    <ul>
                        <li> <NavLink to="/" >Главная</NavLink></li>
                        <li> <NavLink to="/planner" >Планировщик</NavLink></li>
                        <li> <NavLink to="/stands" >Стенды</NavLink></li>
                        <li> <NavLink to="/admin" >Администрирование</NavLink></li>
                        <li> <NavLink to="/about">О приложении</NavLink></li>
                    </ul>
                </nav>
            </div>
            <div className="content">
                <Outlet />
            </div>

    
        </>
    );
}

export default Base;