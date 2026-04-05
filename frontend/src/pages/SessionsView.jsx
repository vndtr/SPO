// frontend/src/pages/SessionsView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import SessionItem from '../components/sessionsComps/sessionItem.jsx';
import CreateSessionModal from '../components/sessionsComps/CreateSessionModal.jsx';
import { getSessions, createSession, getBookById, getSessionParticipantsCount, getSessionNotesCount, getSessionProgress } from '../services/api';
import '../styles/pages/sessions.css';

export default function SessionsView() {
  const [sessions, setSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();

    const handleSessionsUpdate = () => {
      loadSessions();
    };
    
    window.addEventListener('sessionsUpdated', handleSessionsUpdate);
    
    return () => {
      window.removeEventListener('sessionsUpdated', handleSessionsUpdate);
    };
  }, []);

  const sortSessions = (sessionsList, order) => {
    return [...sessionsList].sort((a, b) => {
      if (order === 'asc') {
        return a.name.localeCompare(b.name, 'ru');
      } else {
        return b.name.localeCompare(a.name, 'ru');
      }
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setSessions(sortSessions(sessions, order));
  };

  const loadSessions = async () => {
    try {
      setLoading(true);
      const sessionsData = await getSessions();
      
      const booksData = {};
      const sessionsWithStats = await Promise.all(sessionsData.map(async (session) => {
        if (!booksData[session.book_id]) {
          try {
            const book = await getBookById(session.book_id);
            booksData[session.book_id] = book;
          } catch (err) {
            booksData[session.book_id] = { title: 'Неизвестно', author: 'Неизвестен' };
          }
        }
        
        const members = await getSessionParticipantsCount(session.id);
        const notes = await getSessionNotesCount(session.id);
        const progress = await getSessionProgress(session.id, session.book_id);
        
        return {
          ...session,
          members,
          notes,
          progress
        };
      }));
      
      setBooks(booksData);
      const sortedSessions = sortSessions(sessionsWithStats, sortOrder);
      setSessions(sortedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      const newSession = await createSession(sessionData);
      await loadSessions();
      navigate(`/session-reader?sessionId=${newSession.id}&name=${encodeURIComponent(newSession.name)}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Ошибка при создании сессии');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="sessions-layout">
          <NavAside />
          <div className="sessions-container">
            <div className="sessions-loading">Загрузка...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="sessions-layout">
        <NavAside />
        <div className="sessions-container">
          <div className="sessions-header">
            <div className="sessions-title-section">
              <h2 className="sessions-title">Мои сессии</h2>
            </div>
            
            <div className="sessions-actions">
              <div className="sort-buttons">
                <span className="sort-label">Сортировать:</span>
                <button
                  onClick={() => handleSortChange('asc')}
                  className={`sort-button ${sortOrder === 'asc' ? 'sort-button-active' : ''}`}
                >
                  А → Я
                </button>
                <button
                  onClick={() => handleSortChange('desc')}
                  className={`sort-button ${sortOrder === 'desc' ? 'sort-button-active' : ''}`}
                >
                  Я → А
                </button>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="create-session-button"
              >
                <svg className="create-session-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                Создать сессию
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="sessions-empty">
              <p className="empty-title">У вас пока нет сессий</p>
              <p className="empty-text">Нажмите "Создать сессию", чтобы начать совместное чтение</p>
            </div>
          ) : (
            <div className="sessions-grid">
              {sessions.map((session) => {
                const book = books[session.book_id];
                return (
                  <SessionItem 
                    key={session.id}
                    id={session.id}
                    name={session.name}
                    book_title={book?.title || 'Загрузка...'}
                    book_author={book?.author || 'Неизвестен'}
                    progress={session.progress || 0}
                    members={session.members || 1}
                    notes={session.notes || 0}
                    link={session.link}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSession}
        />
      )}
    </>
  );
}