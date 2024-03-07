import React, { useContext, useState, createContext}from "react";
import {Routes, Route, useLocation, Navigate, Outlet,} from "react-router-dom"
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands"
import Planner from "./Planner/Planner"   
import Admin from "./Admin/Admin"   
import About from "./About/About"   
import Clock from "./Clock/Clock"
import Login from "./Login/Login";
  



function PrivateRoute() {
    const { isAuthenticated } = useContext(AuthContext); // используем контекст для получения значения isAuthenticated
    const location = useLocation(); // получаем текущий маршрут с помощью хука useLocation()
    
    if (isAuthenticated === 'true') {
        return <Outlet />
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
}

// const isAuthenticated = false

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Используем хук useState для создания переменной isAuthenticated и функции setAuth для ее изменения
    const [isAuthenticated, setAuth] = useState(false);
    
    // Возвращаем контекст провайдера, передавая значения isAuthenticated и setAuth в качестве значения контекста
    return (
      <AuthContext.Provider value={{ isAuthenticated, setAuth }}>
        {children}
      </AuthContext.Provider>
    );
  };


export default function App() {

    return (
        <>  
            {/* <AuthContext.Provider value={{isAuthenticated: false}}> */}
            <AuthProvider>

            <Clock/>
            <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route element={<PrivateRoute />}> */}
                <Route path="/" element={<Base />}>
                    <Route index element={<Main />}/>
                    <Route path="planner" element={<Planner />}/>
                    <Route path="stands" element={<Stands />}/>
                    <Route path="admin" element={<Admin />}/>
                    <Route path="about" element={<About />}/>
                </Route> 
            {/* </Route> */}
            </Routes>
            </AuthProvider>
            {/* </AuthContext.Provider> */}
        </>
    );
}
