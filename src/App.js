import logo from './logo.svg';
import './App.css';

import { Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import { createTheme, SpeedDial, SpeedDialAction, SpeedDialIcon, ThemeProvider } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import DownloadingIcon from '@mui/icons-material/Downloading';
import NotFoundPage from './Pages/NotFoundPage';
import RequestModPage from './Pages/RequestModPage';
import AdminPanelLoginPage from './Pages/AdminPanelLoginPage';
import { AuthContextProvider, useAuthState } from './Services/FirebaseService';
import AdminPanelDashboardPage from './Pages/AdminPanelDashboardPage';
import { useEffect } from 'react';
import ProtectedRoute from './Pages/ProtectedRoute';
import RouterComponent from './Components/RouterComponent';

function App() {
  const darkTheme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  const navigate = useNavigate();

  return (
    <ThemeProvider theme={darkTheme}>
      <AuthContextProvider>
        <div className="App">
          <header className='App-header'>
            <SpeedDial ariaLabel='main page nav' sx={{ position: 'fixed', bottom: 16, right: 16 }} icon={<SpeedDialIcon/>} direction="left">
              <SpeedDialAction key="adminpanel" icon={<AdminPanelSettingsIcon/>} tooltipTitle="Admin Panel" onClick={() => navigate("/admin")}/>
              <SpeedDialAction key="requestmod" icon={<LibraryAddIcon/>} tooltipTitle="Request Mod" onClick={() => navigate("/request")}/>
              <SpeedDialAction key="installmodpack" icon={<DownloadingIcon/>} tooltipTitle="Install Modpack" onClick={() => navigate("/install")}/>
              <SpeedDialAction key="home" icon={<HomeIcon/>} tooltipTitle="Home" onClick={() => navigate("/")}/>
            </SpeedDial>

            <RouterComponent/>
          </header>
        </div>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

export default App;
