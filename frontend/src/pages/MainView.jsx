import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import { getLastOpenedBook, getRecentSessions, getRecentAnswers } from '../services/api';
import Progressbar from '../components/UI/Progressbar';
import '../styles/pages/main.css';

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
        setupWebSocket();
        
        const handleProgressUpdate = (event) => {
            const { bookId, page } = event.detail;
            if (lastBook && lastBook.id === bookId) {
                const totalPages = localStorage.getItem(`book_${bookId}_total_pages`);
                if (totalPages && parseInt(totalPages) > 0) {
                    const progress = Math.round((page / parseInt(totalPages)) * 100);
                    setLastBook(prev => ({ ...prev, progress: Math.min(progress, 100) }));
                }
            }
        };
        
        window.addEventListener('progressUpdated', handleProgressUpdate);
        
        return () => {
            isMounted.current = false;
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            window.removeEventListener('progressUpdated', handleProgressUpdate);
        };
    }, [lastBook?.id]);

    const setupWebSocket = () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        
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
            if (isMounted.current) {
                reconnectTimeoutRef.current = setTimeout(() => {
                    setupWebSocket();
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
                <div className="flex">
                    <NavAside />
                    <div className="main-container">
                        <div className="reader-loading-text">Загрузка...</div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="flex">
                <NavAside />
                <div className="main-container">
                    <div className="main-left">
                        <div className="continue-section">
                            <h1 className="section-title">Продолжить</h1>
                            {lastBook ? (
                                <div className="continue-card">
                                    <div className="continue-card-image-placeholder">
                                        <svg className="continue-card-placeholder-icon" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3.5 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5h-9z"/>
                                        </svg>
                                    </div>
                                    <div className="continue-card-content">
                                        <h2 className="continue-card-title">{lastBook.title}</h2>
                                        <h3 className="continue-card-author">{lastBook.author}</h3>
                                        <Progressbar progress={lastBook.progress || 0} />
                                        <div className="continue-card-meta">
                                            Прогресс: {lastBook.progress || 0}%
                                        </div>
                                        <Link to={`/reader?bookId=${lastBook.id}&title=${encodeURIComponent(lastBook.title)}&author=${encodeURIComponent(lastBook.author)}`}>
                                            <button className="continue-card-btn">
                                                Продолжить чтение
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="continue-card-empty">
                                    Нет открытых книг. Перейдите в библиотеку, чтобы добавить книгу.
                                </div>
                            )}
                        </div>
                        
                        <div className="sessions-section">
                            <div className="section-header">
                                <h1 className="section-title">Ваши сессии</h1>
                                <Link to="/sessions">
                                    <h3 className="view-all-link">Смотреть все</h3>
                                </Link>
                            </div>
                            <div className="sessions-grid">
                                {recentSessions.length > 0 ? (
                                    recentSessions.map((session) => (
                                        <div key={session.id} className="session-card">
                                            <div className="session-card-image-placeholder">
                                                <svg className="session-card-placeholder-icon" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M3.5 2.5a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5h-9z"/>
                                                </svg>
                                            </div>
                                            <div className="session-card-content">
                                                <h2 className="session-card-title">{session.name}</h2>
                                                <h3 className="session-card-author">{session.book_title} — {session.book_author}</h3>
                                                <div className="session-card-action">
                                                    <Link to={`/session-reader?sessionId=${session.id}&name=${encodeURIComponent(session.name)}`}>
                                                        <button className="session-card-btn">
                                                            Перейти
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="sessions-empty-message">
                                        Нет активных сессий. Создайте новую сессию.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="main-right">
                        <div className="notifications-card">
                            <div className="notifications-header">
                                <h3>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                    </svg>
                                    Новые ответы
                                </h3>
                                {notifications.length > 0 && (
                                    <span className="notifications-badge">{notifications.length}</span>
                                )}
                                <svg className="notifications-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </div>
                            <div className="notifications-list">
                                {notifications.length === 0 ? (
                                    <div className="empty-state">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <p>Нет новых ответов</p>
                                    </div>
                                ) : (
                                    notifications.map((notification) => (
                                        <Link 
                                            key={notification.id}
                                            to={`/session-reader?sessionId=${notification.session_id}&highlightNoteId=${notification.note_id}`}
                                            className="notification-item"
                                        >
                                            <div className="notification-icon">
                                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <div className="notification-content">
                                                <p className="notification-text">{notification.message}</p>
                                                <p className="notification-text quote">"{notification.answer_text}"</p>
                                                <p className="notification-time">{formatDate(notification.created_at)}</p>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}