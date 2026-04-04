import React, { useState, useEffect } from 'react';
import { getBooks } from '../../services/api';

export default function CreateSessionModal({ onClose, onCreate }) {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const data = await getBooks();
      setBooks(data);
      if (data.length > 0) {
        setSelectedBookId(data[0].id);
      }
    } catch (err) {
      console.error('Error loading books:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionName.trim()) {
      setError('Введите название сессии');
      return;
    }
    if (!selectedBookId) {
      setError('Выберите книгу');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onCreate({
        name: sessionName,
        book_id: selectedBookId
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при создании сессии');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div 
        className="bg-beige-1 p-6 rounded-2xl max-w-md w-full text-blue flex flex-col gap-4 border border-accent-1 shadow-2xl relative z-[10001]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium">Создание сессии</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название сессии</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Например: Обсуждение главы 1"
              className="w-full p-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Книга</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full p-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
            >
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-accent-1 text-accent-1 rounded-xl hover:bg-accent-1/10"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать сессию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}