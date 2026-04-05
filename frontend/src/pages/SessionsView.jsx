// frontend/src/pages/SessionsView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import SessionItem from '../components/sessionsComps/sessionItem.jsx';
import CreateSessionModal from '../components/sessionsComps/CreateSessionModal.jsx';
import { getSessions, createSession, getBookById, getSessionParticipantsCount, getSessionNotesCount, getSessionProgress } from '../services/api';

export default function SessionsView() {
  const [sessions, setSessions] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState({});
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
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
        // Загружаем книгу
        if (!booksData[session.book_id]) {
          try {
            const book = await getBookById(session.book_id);
            booksData[session.book_id] = book;
          } catch (err) {
            booksData[session.book_id] = { title: 'Неизвестно', author: 'Неизвестен' };
          }
        }
        
        // Считаем участников
        const members = await getSessionParticipantsCount(session.id);
        
        // Считаем заметки
        const notes = await getSessionNotesCount(session.id);
        
        // Считаем прогресс
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
      await loadSessions(); // Перезагружаем список после создания
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
        <div className='flex'>
          <NavAside />
          <div className='bg-beige-1 flex text-accent-2 w-screen p-10 justify-center items-center'>
            <div>Загрузка...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='flex'>
        <NavAside />
        <div className='bg-beige-1 flex flex-col text-accent-2 w-screen p-10'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-blue text-3xl mb-4'>Мои сессии</h2>
            </div>
            
            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <span className="text-sm text-gray-600">Сортировать:</span>
                <button
                  onClick={() => handleSortChange('asc')}
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    sortOrder === 'asc' 
                      ? 'bg-accent-1 text-beige-1' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  А → Я
                </button>
                <button
                  onClick={() => handleSortChange('desc')}
                  className={`px-3 py-2 rounded-xl transition-colors ${
                    sortOrder === 'desc' 
                      ? 'bg-accent-1 text-beige-1' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Я → А
                </button>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className='relative bg-accent-1 text-beige-1 rounded-xl h-fit py-4 px-8 pl-10 cursor-pointer'
              >
                Создать сессию
                <svg className='absolute ml-2 left-3 top-1/2 -translate-y-1/2 w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
              </button>
            </div>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl mb-4">У вас пока нет сессий</p>
              <p>Нажмите "Создать сессию", чтобы начать совместное чтение</p>
            </div>
          ) : (
            <div className='grid grid-cols-2 mt-4 gap-10'>
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