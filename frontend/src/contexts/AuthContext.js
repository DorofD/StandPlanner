import React, {useState, createContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Используем хук useState для создания переменной isAuthenticated и функции setAuth для ее изменения
    const [isAuthenticated, setAuth] = useState(false);
    const [userName, setUserName] = useState("defaultUser");
    const [userRole, setUserRole] = useState("admin")
    // Возвращаем контекст провайдера, передавая значения isAuthenticated и setAuth в качестве значения контекста
    return (
      <AuthContext.Provider value={{ isAuthenticated, userName, userRole, toogleAuth: () => setAuth(prev => !prev), setUserName, setUserRole }}>
        {children}
      </AuthContext.Provider>
    );
};