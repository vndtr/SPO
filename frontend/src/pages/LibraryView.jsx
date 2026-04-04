// frontend/src/pages/LibraryView.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import LibraryBook from '../components/libraryComps/LibraryBook.jsx';
import UploadBookModal from '../components/libraryComps/UploadBookModal.jsx';
import { getBooks, uploadBook, deleteBook, getCurrentUser } from '../services/api';

export default function LibraryView() {
  const [books, setBooks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
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

  const loadBooks = async () => {
    try {
      setLoading(true);
      const data = await getBooks();
      console.log('Books loaded:', data);
      // Адаптируем данные под формат, ожидаемый LibraryBook
      const adaptedBooks = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        progress: 0,
        coverImage: book.cover_img || '',
        coverColor: 'bg-blue-300'
      }));
      setBooks(adaptedBooks);
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
        <div className='flex'>
          <NavAside />
          <div className='bg-beige-1 flex flex-col text-accent-2 w-screen p-10'>
            <div className="text-center py-20">Загрузка пользователя...</div>
          </div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className='flex'>
          <NavAside />
          <div className='bg-beige-1 flex flex-col text-accent-2 w-screen p-10'>
            <div className="text-center py-20 text-red-500">
              <p className="text-xl mb-4">Ошибка авторизации</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-accent-1 text-beige-1 rounded"
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
      <div className='flex'>
        <NavAside />
        <div className='bg-beige-1 flex flex-col text-accent-2 w-screen p-10'>
          <div className='flex justify-between'>
            <div>
              <h2 className='text-blue text-3xl mb-4'>Моя библиотека</h2>
              <h3>Ваши книги для личного и совместного просмотра</h3>
            </div>
            
            <button
              onClick={() => setShowUploadModal(true)}
              className='relative bg-accent-1 text-beige-1 rounded-xl h-fit py-4 px-8 pl-10 cursor-pointer'
              disabled={loading}
            >
              Загрузить книгу
              <svg className='absolute ml-2 left-3 top-1/2 -translate-y-1/2 w-5 h-5' 
                   xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
            </button>
          </div>

          {loading && <div className="text-center py-10">Загрузка...</div>}

          {!loading && books.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl mb-4">В библиотеке пока нет книг</p>
              <p>Нажмите "Загрузить книгу", чтобы добавить первую книгу</p>
            </div>
          )}

          <div className="grid grid-cols-4 gap-10 mt-8">
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