import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Live Vercel Backend URL
export const API_BASE_URL = "https://github-clone-auvj.vercel.app";

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('userId'));

    const login = (userId) => {
        localStorage.setItem('userId', userId);
        setCurrentUser(userId);
    };

    const logout = () => {
        localStorage.removeItem('userId');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        setCurrentUser,
        login,
        logout,
        API_BASE_URL
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};