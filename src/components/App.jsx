import React, { useContext, useState, createContext, useEffect}from "react";
import { Routes, Route } from "react-router-dom"
import Main from "./Main/Main"
import Base from "./Base/Base"
import Stands from "./Stands/Stands"
import Planner from "./Planner/Planner"   
import Admin from "./Admin/Admin"   
import About from "./About/About"   
import Users from "./Users/Users";
import Bots from "./Bots/Bots";
import Logs from "./Logs/Logs";
import { PrivateRoute } from "./PrivateRoute/PrivateRoute";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    // Используем хук useState для создания переменной isAuthenticated и функции setAuth для ее изменения
    const [isAuthenticated, setAuth] = useState(false);
    const [userName, setUserName] = useState("defaultUser");
    
    // Возвращаем контекст провайдера, передавая значения isAuthenticated и setAuth в качестве значения контекста
    return (
      <AuthContext.Provider value={{ isAuthenticated, userName, toogleAuth: () => setAuth(prev => !prev), setUserName }}>
        {children}
      </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext)

// контекст уведомлений
export const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
    // Используем хук useState для создания переменной isAuthenticated и функции setAuth для ее изменения
    const [notificationData, setNotificationData] = useState({message:'', type:''});
    
    // Возвращаем контекст провайдера, передавая значения isAuthenticated и setAuth в качестве значения контекста
    return (
      <NotificationContext.Provider value={{ notificationData, setNotificationData }}>
        {children}
      </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => useContext(NotificationContext)


export default function App() {
    
    return (
        <>  
                <Routes>
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Base />}>
                            <Route index element={<Main />}/>
                            <Route path="/planner" element={<Planner />}/>
                            <Route path="/stands" element={<Stands />}/>
                            <Route path="/admin" element={<Admin />}>
                                <Route path="/admin/users" element={<Users />}/>
                                <Route path="/admin/bots" element={<Bots />}/>
                                <Route path="/admin/logs" element={<Logs />}/>
                            </Route>
                            <Route path="/about" element={<About />}/>
                        </Route>
                    </Route>
                </Routes>
        </>
    );
}
