import React from "react";
import { Navigate } from "react-router-dom";

/*

    A protected route object, which receives a component / page to render if the user is authenticated,
    but instead returns a router navigate element to send the user back to the login page if they are
    unauthenticated, to stop any unauthenticated users from reaching the page which is passed to it.

*/
export default function ProtectedRoute({ isSignedIn, children }) {
    if (!isSignedIn) {
        return <Navigate replace to="/login"/>
    }

    return children;
}