import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, getUserAuthHeaders } from '../config/api';

const USER_KEY = 'amar_recipe_user';
const TOKEN_KEY = 'amar_recipe_token';

const UserAuthContext = createContext(null);

export function useUserAuth() {
    return useContext(UserAuthContext);
}

function readStoredUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function UserAuthProvider({ children }) {
    const [user, setUser] = useState(() => readStoredUser());
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [loading, setLoading] = useState(!!localStorage.getItem(TOKEN_KEY));

    const persist = (nextUser, nextToken) => {
        if (nextUser && nextToken) {
            localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
            localStorage.setItem(TOKEN_KEY, nextToken);
        } else {
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
        }
        setUser(nextUser);
        setToken(nextToken);
    };

    useEffect(() => {
        const currentToken = localStorage.getItem(TOKEN_KEY);
        if (!currentToken) {
            setLoading(false);
            return;
        }

        fetch(API_BASE_URL + 'get_user_me.php', {
            headers: getUserAuthHeaders(),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.user) {
                    persist(data.user, currentToken);
                } else if (data.success === false) {
                    // Session invalid or expired on backend
                    persist(null, null);
                }
            })
            .catch((err) => {
                // Network hiccup or Render cold start - keep current user session
                console.warn('Could not refresh user session from backend:', err);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (nextUser, nextToken) => persist(nextUser, nextToken);

    const logout = async () => {
        try {
            await fetch(API_BASE_URL + 'user_logout.php', {
                method: 'POST',
                headers: getUserAuthHeaders({ 'Content-Type': 'application/json' }),
            });
        } catch {
            // Local logout still proceeds
        }
        persist(null, null);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            loading,
            isLoggedIn: Boolean(user && token),
            login,
            logout,
            setUser: (nextUser) => persist(nextUser, token),
        }),
        [user, token, loading]
    );

    return (
        <UserAuthContext.Provider value={value}>
            {children}
        </UserAuthContext.Provider>
    );
}
