// frontend/src/components/mainComps/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { searchAll } from '../../services/api';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ books: [], sessions: [] });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults({ books: [], sessions: [] });
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchAll(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery('');
    
    if (result.type === 'book') {
      navigate(`/reader?bookId=${result.id}&title=${encodeURIComponent(result.title)}&author=${encodeURIComponent(result.author)}`);
    } else if (result.type === 'session') {
      navigate(`/session-reader?sessionId=${result.id}&name=${encodeURIComponent(result.name)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='flex text-accent-2'>
      <div className='max-w-[30vw] min-w-[15vw] flex justify-center bg-gray items-center'>
        <Link to='/'>
          <svg
            className="w-32 h-32 text-beige-1"
            viewBox="0 0 881.3 192.21"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            {/* Логотип SVG */}
            <g>
              <path d="M.45,113.21c3.55,2.61,50.38,3.65,71.89-6.55,21.75-10.32,32.74-22.84,52.74-27.27,33.59-7.43,65.4,13.4,62,12.53-7.53-1.94-27.07-9.66-58.34.83-14.31,4.8-18.48,7.51-35.06,17.37-21.2,12.6-31.33,15.23-51.12,16.05-23.08.96-46.08-15.88-42.1-12.95Z"/>
              <path d="M94.12,126.97c3.55,2.61,50.38,3.65,71.89-6.55,21.75-10.32,32.74-22.84,52.74-27.27,33.59-7.43,65.4,13.4,62,12.53-7.53-1.94-27.07-9.66-58.34.83-14.31,4.8-18.48,7.51-35.06,17.37-21.2,12.6-31.33,15.23-51.12,16.05-23.08.96-46.08-15.88-42.1-12.95Z"/>
            </g>
            <g>
              <path d="M276.27,168.58c10.5,7.19,25.08,12.3,40.7,12.3,27.84,0,44.91-15.82,44.91-38.76,0-20.86-10.85-33.16-37.73-43.53-29.98-10.64-47.95-26.05-47.95-51.41,0-27.29,22.52-47.19,54.17-47.19,17.48,0,30.75,4.49,37.1,8.77l-5.11,11.06c-5.04-3.52-16.93-8.84-32.89-8.84-30.05,0-40.28,19.28-40.28,33.92,0,20.66,11.95,31.23,38.62,41.66,30.75,12.44,47.05,26.39,47.05,54.31s-19.35,51.2-59.08,51.2c-16.1,0-34.82-5.25-44.49-12.51l4.97-10.98Z"/>
              <path d="M413.57,121.6c0,42.35,23.08,59.14,50.44,59.14,19.34,0,29.37-3.87,36.89-7.53l3.39,10.36c-5.11,2.76-18.72,8.5-41.87,8.5-38.14,0-61.84-27.78-61.84-66.6,0-44.29,25.36-72,59.63-72,43.46,0,51.68,40.83,51.68,59.97,0,3.73,0,5.8-.42,8.15h-97.91ZM498.14,111.1c.34-18.52-7.39-46.71-39.66-46.71-29.16,0-41.8,26.25-44.22,46.71h83.88Z"/>
              <path d="M545.62,88.23c0-12.16-.42-21.28-1.11-31.71h12.23l.97,23.97h.55c7.26-14.92,23.91-27.02,45.67-27.02,12.65,0,46.29,6.49,46.29,56.17v79.53h-13.13v-78.35c0-24.18-9.33-46.09-36.76-46.09-18.66,0-34.55,13.34-39.8,30.54-.97,3.18-1.8,7.67-1.8,11.82v82.08h-13.13v-100.95Z"/>
              <path d="M688.31,171.76c7.12,4.49,17.83,9.19,29.85,9.19,20.87,0,30.82-11.47,30.82-25.29,0-14.58-8.77-22.39-27.92-29.92-21.69-8.43-33.65-20.24-33.65-36.34,0-19.14,15.06-35.93,40.84-35.93,12.23,0,22.52,3.66,29.43,8.43l-5.25,10.71c-4.56-3.25-13.13-8.02-26.26-8.02-16.86,0-25.84,10.85-25.84,22.94,0,13.89,9.39,19.76,27.5,27.22,21.42,8.5,34.13,19.14,34.13,39.24,0,22.73-17.61,38.07-44.77,38.07-12.78,0-24.87-3.66-33.71-9.19l4.84-11.12Z"/>
              <path d="M869.21,189.17l-1.93-19h-.62c-6.43,10.22-21.21,22.04-42.28,22.04-26.67,0-39.03-18.79-39.03-36.48,0-30.61,26.94-49.06,80.9-48.5v-3.52c0-13.13-2.56-39.31-33.92-39.11-11.61,0-23.7,3.11-33.31,9.88l-4.15-9.54c12.09-8.22,26.88-11.47,38.9-11.47,38.28,0,45.6,28.74,45.6,52.44v51.75c0,10.5.41,21.35,1.93,31.51h-12.09ZM866.24,118.28c-28.88-.83-67.02,3.52-67.02,35.38,0,19.07,12.57,27.64,26.39,27.64,22.11,0,34.69-13.68,39.24-26.6.97-2.83,1.38-5.67,1.38-7.95v-28.47Z"/>
            </g>
          </svg>
        </Link>
      </div>
      
      <div className='bg-beige-2 w-screen flex justify-between border-b border-accent-1' ref={searchRef}>
        <div className='relative w-full max-w-lg my-6'>
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center text-accent-1 pointer-events-none z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
          </div>
          <input 
            type="text" 
            placeholder='Поиск книг и сессий...' 
            id="mainSearch"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='absolute inset-y-0 w-full pl-10 pr-3 m-5 rounded-3xl bg-beige-1 focus:outline-none focus:ring-2 focus:ring-accent-1'
          />
          
          {showResults && (searchResults.books?.length > 0 || searchResults.sessions?.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-beige-1 rounded-xl shadow-lg border border-accent-1 z-50 max-h-96 overflow-y-auto">
              {searchResults.sessions?.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-semibold text-accent-1 border-b border-accent-1/30">
                    Сессии
                  </div>
                  {searchResults.sessions.map((session) => (
                    <div
                      key={`session-${session.id}`}
                      className="px-3 py-2 hover:bg-accent-1/10 cursor-pointer rounded-lg transition-colors"
                      onClick={() => handleResultClick({ ...session, type: 'session' })}
                    >
                      <div className="font-medium">{session.name}</div>
                      <div className="text-xs text-gray-500">Сессия</div>
                    </div>
                  ))}
                </div>
              )}
              
              {searchResults.books?.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-sm font-semibold text-accent-1 border-b border-accent-1/30">
                    Книги
                  </div>
                  {searchResults.books.map((book) => (
                    <div
                      key={`book-${book.id}`}
                      className="px-3 py-2 hover:bg-accent-1/10 cursor-pointer rounded-lg transition-colors"
                      onClick={() => handleResultClick({ ...book, type: 'book' })}
                    >
                      <div className="font-medium">{book.title}</div>
                      <div className="text-xs text-gray-500">{book.author}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {loading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-beige-1 rounded-xl shadow-lg border border-accent-1 z-50 p-4 text-center">
              <div className="text-sm text-gray-500">Поиск...</div>
            </div>
          )}
        </div>

        <div className='flex p-10 m-4 gap-10 text-gray'>
          <Link to="/profile">
            <button className='hover:cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8"/>
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}