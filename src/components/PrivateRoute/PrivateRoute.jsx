import React from "react";
import { useAuthContext } from "../App";
import { Outlet } from "react-router-dom";
import Login from "../Login/Login";


export const PrivateRoute = () => {
    
    const { isAuthenticated } = useAuthContext();
    console.log(isAuthenticated, 'in PrivateRoute')
    if (isAuthenticated) {
        return <Outlet/>
    } else {
        return <Login/>;
      }
}