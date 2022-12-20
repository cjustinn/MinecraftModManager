import React, { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPanelDashboardPage from '../Pages/AdminPanelDashboardPage';
import AdminPanelLoginPage from '../Pages/AdminPanelLoginPage';
import HomePage from '../Pages/HomePage';
import NotFoundPage from '../Pages/NotFoundPage';
import ProtectedRoute from '../Pages/ProtectedRoute';
import RequestModPage from '../Pages/RequestModPage';
import UnprotectedRoute from '../Pages/UnprotectedRoute';
import { AuthContext, useAuthState } from '../Services/FirebaseService';

export default function RouterComponent() {
    const { isAuthenticated } = useAuthState();

    return <Routes>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/" element={<Navigate to="/home" replace/>}/>
        <Route path="/request" element={<RequestModPage/>}/>
        <Route path="/admin" element={
            <ProtectedRoute isSignedIn={isAuthenticated}>
                <AdminPanelDashboardPage/>
            </ProtectedRoute>
        }/>
        <Route path="/login" element={
            <UnprotectedRoute isSignedIn={isAuthenticated}>
                <AdminPanelLoginPage/>
            </UnprotectedRoute>
        }/>
        <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
}