import React from 'react';
import { Navigate } from 'react-router-dom';

/*

    A protected route object similar to the 'ProtectedRoute' component, but flipped.
    If the user *is* authenticated, they will be redirected back to the admin panel
    dashboard, however any unauthenticated users will be displayed the component passed
    as the 'children' value.

*/
export default function UnprotectedRoute({ isSignedIn, children }) {
    if (isSignedIn) {
        return <Navigate replace to="/admin"/>
    }

    return children;
}