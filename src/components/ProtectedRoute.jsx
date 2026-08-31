import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthToken } from '../lib/api';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = getAuthToken();

    if (!token) {
        return <Navigate to="/sign-in" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
