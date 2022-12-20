import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isSignedIn, children }) {
    if (!isSignedIn) {
        return <Navigate replace to="/login"/>
    }

    return children;
}