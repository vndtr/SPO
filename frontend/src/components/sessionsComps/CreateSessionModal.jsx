import React, { useState, useEffect } from 'react';
import { getBooks } from '../../services/api';
import '../../styles/components/modal.css';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop"></div>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Создание сессии</h3>
          <button onClick={onClose} className="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className="modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Название сессии</label>
            <input
              type="text"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Например: Обсуждение главы 1"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Книга</label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="form-select"
            >
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="form-button-cancel"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="form-button-submit"
            >
              {loading ? 'Создание...' : 'Создать сессию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}