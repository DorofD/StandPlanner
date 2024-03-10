import React, { Component, useState, useEffect} from "react";
import "./Base.css";
import { NavLink as NavLinkBase, Outlet } from "react-router-dom";
import { useAuthContext } from "../App";
import Button from "../Button/Button";

const NavLink = React.forwardRef((props, ref) => (
  <NavLinkBase
    ref={ref}
    {...props}
    className={props.activeClassName}
  />
));


export default function Base() {
    const { isAuthenticated, toogleAuth} = useAuthContext()
    const {userName} = useAuthContext()
    const [now, setNow] = useState(new Date())
    
    useEffect(() => {
        setInterval(() => setNow(new Date()), 1000)
    }, [])

    return (
        <>
            <div className="header">
                <span className="header">{now.toLocaleTimeString()}</span>
                {userName}
                <Button style={"logout"} type={"submit"} onClick={toogleAuth}> Выйти </Button> 
            </div>
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
