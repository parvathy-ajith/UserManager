import React, { createContext, useState } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [username, setUsername] = useState(localStorage.getItem("username") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    const login = (newToken, newUsername, newRole) => {
        setToken(newToken);
        setUsername(newUsername)
        setRole(newRole);
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", newUsername);
        localStorage.setItem("role", newRole);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    }

    return (
        <AuthContext.Provider value={{ token, username, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}
