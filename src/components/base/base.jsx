import React, { Component } from "react";
import "./base.css";
import { Outlet, Link} from "react-router-dom";

import { NavLink as NavLinkBase } from 'react-router-dom'; 

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
                <nav>
                    <ul>
                        <li> <NavLink to="/" >Главная</NavLink></li>
                        <li> <NavLink to="/mgmt" >Управление</NavLink></li>
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