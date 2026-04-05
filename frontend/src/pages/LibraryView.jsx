import React, { useState, useEffect } from 'react';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import LibraryBook from '../components/libraryComps/LibraryBook.jsx';
import UploadBookModal from '../components/libraryComps/UploadBookModal.jsx';
import { getBooks, uploadBook, deleteBook, getCurrentUser, getBookProgress } from '../services/api';
import '../styles/pages/library.css';

export default function LibraryView() {
  const [books, setBooks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadCurrentUser();
    
    const handleProgressUpdate = (event) => {
      const { bookId, page } = event.detail;
      setBooks(prevBooks => prevBooks.map(book => {
        if (book.id === bookId) {
          const totalPages = localStorage.getItem(`book_${bookId}_total_pages`);
          if (totalPages && parseInt(totalPages) > 0) {
            const progress = Math.round((page / parseInt(totalPages)) * 100);
            return { ...book, progress: Math.min(progress, 100) };
          }
        }
        return book;
      }));
    };
    
    window.addEventListener('progressUpdated', handleProgressUpdate);
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
    };
  }, []);

  const loadCurrentUser = async () => {
    try {
      setAuthLoading(true);
      const user = await getCurrentUser();
      console.log('Current user loaded:', user);
      if (user && user.user_id) {
        setCurrentUser(user);
        await loadBooks();
      } else {
        console.error('User not found or invalid');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setAuthLoading(false);
    }
  };

  const sortBooks = (booksList, order) => {
    return [...booksList].sort((a, b) => {
      if (order === 'asc') {
        return a.title.localeCompare(b.title, 'ru');
      } else {
        return b.title.localeCompare(a.title, 'ru');
      }
    });
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setBooks(sortBooks(books, order));
  };

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      
      const adaptedBooks = await Promise.all(data.map(async (book) => {
        const progress = await getBookProgress(book.id);
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          progress: progress,
          coverImage: book.cover_img || '',
          coverGradient: book.cover_gradient || null
        };
      }));
      
      const sortedBooks = sortBooks(adaptedBooks, sortOrder);
      setBooks(sortedBooks);
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadBook = async (file, title, author) => {
    if (!currentUser || !currentUser.user_id) {
      console.error('No user found');
      alert('Пожалуйста, войдите в систему заново');
      window.location.href = '/login';
      return;
    }
    
    try {
      setLoading(true);
      const newBook = await uploadBook(file, title, author);
      console.log('Book uploaded:', newBook);
      await loadBooks();
      setShowUploadModal(false);
      alert('Книга успешно загружена!');
    } catch (error) {
      console.error('Error uploading book:', error);
      alert('Ошибка при загрузке книги: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      setLoading(true);
      await deleteBook(bookId);
      setBooks(prev => prev.filter(book => book.id !== bookId));
      alert('Книга успешно удалена');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Ошибка при удалении книги');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Header />
        <div className="library-layout">
          <NavAside />
          <div className="library-container">
            <div className="library-loading">Загрузка пользователя...</div>
          </div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="library-layout">
          <NavAside />
          <div className="library-container">
            <div className="library-empty">
              <p className="empty-title">Ошибка авторизации</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="upload-button"
                style={{ display: 'inline-block', width: 'auto' }}
              >
                Войти снова
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="library-layout">
        <NavAside />
        <div className="library-container">
          <div className="library-header">
            <div className="library-title-section">
              <h2 className="library-title">Моя библиотека</h2>
              <p className="library-subtitle">Ваши книги для личного и совместного просмотра</p>
            </div>
            
            <div className="library-actions">
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
                onClick={() => setShowUploadModal(true)}
                className="upload-button"
                disabled={loading}
              >
                <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                </svg>
                Загрузить книгу
              </button>
            </div>
          </div>

          {loading && <div className="library-loading">Загрузка...</div>}

          {!loading && books.length === 0 && (
            <div className="library-empty">
              <p className="empty-title">В библиотеке пока нет книг</p>
              <p className="empty-text">Нажмите "Загрузить книгу", чтобы добавить первую книгу</p>
            </div>
          )}

          <div className="books-grid">
            {books.map((book) => (
              <LibraryBook 
                key={book.id}
                id={book.id}          
                title={book.title}
                author={book.author}
                progress={book.progress}
                coverColor={book.coverColor}
                src={book.coverImage}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        </div>
      </div>

      {showUploadModal && (
        <UploadBookModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadBook}
        />
      )}
    </>
  );
}