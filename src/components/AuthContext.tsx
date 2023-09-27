import React, { createContext, useContext } from 'react';

const AuthContext = createContext<{
    checkAuth: () => Promise<void>;
}>({
    checkAuth: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ checkAuth: () => Promise<void>; children: React.ReactNode }> = ({ children, checkAuth }) => {
    return (
        <AuthContext.Provider value={{ checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
