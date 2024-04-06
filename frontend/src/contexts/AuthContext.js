import React, {useState, createContext} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setAuth] = useState(false);
    const [userName, setUserName] = useState("defaultUser");
    const [userRole, setUserRole] = useState("admin")
    return (
      <AuthContext.Provider value={{ isAuthenticated, userName, userRole, toogleAuth: () => setAuth(prev => !prev), setUserName, setUserRole }}>
        {children}
      </AuthContext.Provider>
    );
};