import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AdminPanelDashboardPage from '../Pages/AdminPanelDashboardPage';
import AdminPanelLoginPage from '../Pages/AdminPanelLoginPage';
import DownloadPage from '../Pages/DownloadPage';
import HomePage from '../Pages/HomePage';
import NotFoundPage from '../Pages/NotFoundPage';
import ProtectedRoute from '../Pages/ProtectedRoute';
import RequestModPage from '../Pages/RequestModPage';
import UnprotectedRoute from '../Pages/UnprotectedRoute';
import { useAuthState } from '../Services/FirebaseService';

export default function RouterComponent() {
    // Extract the 'isAuthenticated' value from the auth context.
    const { isAuthenticated } = useAuthState();

    // Return the react router list of routes to handle page navigation and page / component rendering.
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
        <Route path="/install" element={<DownloadPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
}