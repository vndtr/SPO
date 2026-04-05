// frontend/src/pages/MainView.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import { getLastOpenedBook, getRecentSessions, getRecentAnswers } from '../services/api';
import Progressbar from '../components/UI/Progressbar';

export default function MainView() {
    const [lastBook, setLastBook] = useState(null);
    const [recentSessions, setRecentSessions] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const isMounted = useRef(true);
    

    useEffect(() => {
        isMounted.current = true;
        loadData();
        connectWebSocket();
        
        return () => {
            isMounted.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []);

    // frontend/src/pages/MainView.jsx

useEffect(() => {
  loadData();
  setupWebSocket();
  
  // Слушаем обновления прогресса
  const handleProgressUpdate = (event) => {
    const { bookId, page } = event.detail;
    // Обновляем прогресс последней открытой книги
    if (lastBook && lastBook.id === bookId) {
      // Получаем общее количество страниц
      const totalPages = localStorage.getItem(`book_${bookId}_total_pages`);
      if (totalPages && parseInt(totalPages) > 0) {
        const progress = Math.round((page / parseInt(totalPages)) * 100);
        setLastBook(prev => ({ ...prev, progress: Math.min(progress, 100) }));
      }
    }
  };
  
  window.addEventListener('progressUpdated', handleProgressUpdate);
  
  return () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    window.removeEventListener('progressUpdated', handleProgressUpdate);
  };
}, []);

// frontend/src/pages/MainView.jsx

const setupWebSocket = () => {
  const token = localStorage.getItem('access_token');
  if (!token) return;
  
  try {
    const ws = new WebSocket(`ws://localhost:5000/ws/notifications?token=${encodeURIComponent(token)}`);
    
    ws.onopen = () => {
      console.log('Notification WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        if (data.type === 'new_answer') {
          loadNotifications();
        }
      } catch (e) {
        console.error('Error parsing message:', e);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setTimeout(setupWebSocket, 5000);
    };
    
    wsRef.current = ws;
  } catch (err) {
    console.error('Failed to setup WebSocket:', err);
  }
};

    const connectWebSocket = () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
        // Закрываем существующее соединение
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        
        const ws = new WebSocket(`ws://localhost:5000/ws/notifications?token=${encodeURIComponent(token)}`);
        
        ws.onopen = () => {
            console.log('Notification WebSocket connected');
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data);
                if (data.type === 'new_answer') {
                    loadNotifications();
                }
            } catch (e) {
                console.error('Error parsing message:', e);
            }
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        ws.onclose = (event) => {
            console.log('WebSocket disconnected:', event.code, event.reason);
            wsRef.current = null;
            
            // Переподключаемся через 5 секунд
            if (isMounted.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    connectWebSocket();
                }, 5000);
            }
        };
        
        wsRef.current = ws;
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.allSettled([
            loadLastBook(),
            loadRecentSessions(),
            loadNotifications()
        ]);
        setLoading(false);
    };

    const loadLastBook = async () => {
        try {
            const book = await getLastOpenedBook();
            if (isMounted.current) setLastBook(book);
        } catch (error) {
            console.error('Error loading last book:', error);
            if (isMounted.current) setLastBook(null);
        }
    };

    const loadRecentSessions = async () => {
        try {
            const sessions = await getRecentSessions(3);
            if (isMounted.current) setRecentSessions(sessions || []);
        } catch (error) {
            console.error('Error loading recent sessions:', error);
            if (isMounted.current) setRecentSessions([]);
        }
    };

    const loadNotifications = async () => {
        try {
            const data = await getRecentAnswers(10);
            if (isMounted.current) setNotifications(data || []);
        } catch (error) {
            console.error('Error loading notifications:', error);
            if (isMounted.current) setNotifications([]);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'Только что';
            if (diffMins < 60) return `${diffMins} мин назад`;
            if (diffHours < 24) return `${diffHours} ч назад`;
            return `${diffDays} д назад`;
        } catch (e) {
            return '';
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
                <div className='bg-beige-1 flex text-accent-2 w-screen p-10'>
                    <div className='flex-3 text-blue'>
                        <h1 className='text-2xl mb-5'>Продолжить</h1>
                        {lastBook ? (
                            <div className='flex rounded-2xl bg-beige-2 p-4 mb-6'>
                                <div className='w-24 h-32 bg-accent-1/20 rounded-lg flex items-center justify-center mr-4'>
                                    <svg className="w-12 h-12 text-accent-1" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M3.5 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5h-9z"/>
                                    </svg>
                                </div>
                                <div className='w-full'>
                                    <h2 className='text-2xl text-blue'>{lastBook.title}</h2>
                                    <h3 className='text-sm text-gray-600'>{lastBook.author}</h3>
                                    <Progressbar progress={lastBook.progress || 0} />
                                    <div className='my-4'>
                                        Прогресс: {lastBook.progress || 0}%
                                    </div>
                                    <Link to={`/reader?bookId=${lastBook.id}&title=${encodeURIComponent(lastBook.title)}&author=${encodeURIComponent(lastBook.author)}`}>
                                        <button className='bg-accent-1 text-beige-1 rounded-2xl px-8 py-2 hover:cursor-pointer'>
                                            Продолжить чтение
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className='flex rounded-2xl bg-beige-2 p-4 mb-6 text-center text-gray-500'>
                                Нет открытых книг. Перейдите в библиотеку, чтобы добавить книгу.
                            </div>
                        )}
                        
                        <div className='flex-col justify-between my-6'>
                            <div className='flex justify-between'>
                                <h1 className='text-2xl'>Ваши сессии</h1>
                                <Link to='/sessions'>
                                    <h3 className='text-accent-1 text-lg mr-8'>Смотреть все</h3>
                                </Link>
                            </div>
                            <div className='grid grid-cols-2 gap-10'>
                                {recentSessions.length > 0 ? (
                                    recentSessions.map((session) => (
                                        <div key={session.id} className='flex rounded-2xl bg-beige-2 p-4'>
                                            <div className='w-20 h-28 bg-accent-1/20 rounded-lg flex items-center justify-center mr-4'>
                                                <svg className="w-8 h-8 text-accent-1" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M3.5 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5h-9z"/>
                                                </svg>
                                            </div>
                                            <div className='w-full'>
                                                <h2 className='text-xl text-blue'>{session.name}</h2>
                                                <h3 className='text-sm text-gray-600'>{session.book_title} — {session.book_author}</h3>
                                                <div className='flex my-4 justify-end'>
                                                    <Link to={`/session-reader?sessionId=${session.id}&name=${encodeURIComponent(session.name)}`}>
                                                        <button className='bg-accent-1 text-beige-1 rounded-2xl px-6 py-1 hover:cursor-pointer'>
                                                            Перейти
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='col-span-2 text-center text-gray-500 py-8 bg-beige-2 rounded-2xl'>
                                        Нет активных сессий. Создайте новую сессию.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col flex-1 text-blue'>
                        <div className='flex flex-col m-4 p-4 border border-main-3 rounded-lg bg-main-3 h-fit'>
                            <div>
                                <div className='flex justify-between'>
                                    <h2 className="text-lg font-medium">Новые ответы</h2>
                                    {notifications.length > 0 && (
                                        <span className="text-xs text-accent-1">{notifications.length}</span>
                                    )}
                                </div>
                                <div className='mt-3 max-h-96 overflow-y-auto'>
                                    {notifications.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">
                                            Нет новых ответов
                                        </div>
                                    ) : (
                                        notifications.map((notification) => (
                                            <Link 
    key={notification.id}
    to={`/session-reader?sessionId=${notification.session_id}&highlightNoteId=${notification.note_id}`}
    className="block mb-3 p-3 bg-beige-2 rounded-lg hover:bg-accent-1/10 transition-colors cursor-pointer"
>

                                                <p className="text-sm font-medium text-blue">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1 italic line-clamp-2">
                                                    "{notification.answer_text}"
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}