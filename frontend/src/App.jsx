import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainView from './pages/MainView';
import LibraryView from './pages/LibraryView';
import ReaderView from './pages/ReaderView';
import SessionsView from './pages/SessionsView';
import ProfileView from './pages/ProfileView';
import SessionReaderView from './pages/SessionReaderView';
import LoginView from './pages/LoginView';
import { getCurrentUser } from './services/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

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
      <Route path="/" element={isAuthenticated ? <MainView onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/library" element={isAuthenticated ? <LibraryView /> : <Navigate to="/login" />} />
      <Route path="/reader" element={isAuthenticated ? <ReaderView /> : <Navigate to="/login" />} />
      <Route path="/sessions" element={isAuthenticated ? <SessionsView /> : <Navigate to="/login" />} />
      <Route path="/profile" element={isAuthenticated ? <ProfileView onLogout={handleLogout} /> : <Navigate to="/login" />} />
      <Route path="/session-reader" element={isAuthenticated ? <SessionReaderView /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;