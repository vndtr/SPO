// frontend/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainView from './pages/MainView';
import LibraryView from './pages/LibraryView';
import ReaderView from './pages/ReaderView';
import SessionsView from './pages/SessionsView';
import ProfileView from './pages/ProfileView';
import SessionReaderView from './pages/SessionReaderView';
import LoginView from './pages/LoginView';
import { getCurrentUser, getUserSettings } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalSettings, setGlobalSettings] = useState({ font_size: 14, background_color: 'light' });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Слушаем события изменения настроек
    const handleSettingsChange = (event) => {
      setGlobalSettings(event.detail);
      applyGlobalStyles(event.detail);
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);

  // В App.jsx, в функции applyGlobalStyles:
const applyGlobalStyles = (settings) => {
    const bgColors = {
        light: '#ffffff',
        dark: '#2a2a2a',
        beige: '#f5f0e8'
    };
    const textColors = {
        light: '#374151',
        dark: '#e0e0e0',
        beige: '#4a4a4a'
    };
    
    document.body.style.backgroundColor = bgColors[settings.background_color] || '#ffffff';
    document.body.style.color = textColors[settings.background_color] || '#374151';
};


const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
    }
    
    try {
        const user = await getCurrentUser();
        if (user && user.user_id) {
            setIsAuthenticated(true);
            
            // Загружаем настройки из localStorage или с бэкенда
            const savedSettings = localStorage.getItem('reader_settings');
            if (savedSettings) {
                setGlobalSettings(JSON.parse(savedSettings));
                applyGlobalStyles(JSON.parse(savedSettings));
            } else {
                const settings = await getUserSettings();
                setGlobalSettings(settings);
                applyGlobalStyles(settings);
            }
        } else {
            setIsAuthenticated(false);
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
};

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginView onLogin={handleLogin} />} />
      <Route path="/" element={isAuthenticated ? <MainView onLogout={handleLogout} globalSettings={globalSettings} /> : <Navigate to="/login" />} />
      <Route path="/library" element={isAuthenticated ? <LibraryView globalSettings={globalSettings} /> : <Navigate to="/login" />} />
      <Route path="/reader" element={isAuthenticated ? <ReaderView globalSettings={globalSettings} /> : <Navigate to="/login" />} />
      <Route path="/sessions" element={isAuthenticated ? <SessionsView globalSettings={globalSettings} /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <ProfileView onLogout={handleLogout} globalSettings={globalSettings} /> : <Navigate to="/login" />} />
      <Route path="/session-reader" element={isAuthenticated ? <SessionReaderView globalSettings={globalSettings} /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;