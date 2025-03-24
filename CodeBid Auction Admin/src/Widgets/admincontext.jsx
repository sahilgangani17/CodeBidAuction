import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [canWrite, setCanWrite] = useState(false);

    return (
        <AdminContext.Provider value={{ 
            isAuthenticated, 
            setIsAuthenticated, 
            canWrite, 
            setCanWrite 
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
