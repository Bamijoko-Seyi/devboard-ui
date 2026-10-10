import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as apiLogin } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }
        getMe()
            .then(setUser)
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const { token } = await apiLogin(email, password);
        localStorage.setItem("token", token);
        const me = await getMe();
        setUser(me);
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}