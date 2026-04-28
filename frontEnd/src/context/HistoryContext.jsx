import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HistoryContext = createContext(null);

export const HistoryProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [stack, setStack] = useState([]);

    useEffect(() => {
        const path = location.pathname + location.search;
        setStack(prev => {
            // Don't push duplicate consecutive entries
            if (prev.length > 0 && prev[prev.length - 1] === path) return prev;
            return [...prev, path];
        });
    }, [location.pathname, location.search]);

    const canGoBack = stack.length > 1;

    const goBack = (fallback = '/dashboard') => {
        if (canGoBack) {
            setStack(prev => prev.slice(0, -1));
            navigate(-1);
        } else {
            navigate(fallback, { replace: true });
        }
    };

    return (
        <HistoryContext.Provider value={{ canGoBack, goBack }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);
