import React, {useState, createContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setAuth] = useState(false);
    const [userName, setUserName] = useState("defaultUser");
    const [userRole, setUserRole] = useState("admin")
    const [userId, setUserId] = useState(0)
    return (
      <AuthContext.Provider value={{ isAuthenticated, userName, userRole, userId, toogleAuth: () => setAuth(prev => !prev), setUserName, setUserRole, setUserId}}>
        {children}
      </AuthContext.Provider>
    );
};