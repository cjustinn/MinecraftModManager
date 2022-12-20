import React from 'react';
import { Navigate } from 'react-router-dom';

export default function UnprotectedRoute({ isSignedIn, children }) {
    if (isSignedIn) {
        return <Navigate replace to="/admin"/>
    }

    return children;
}