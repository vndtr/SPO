import React, { useState } from 'react';
import '../../styles/components/modal.css';
import '../../styles/components/library.css';

export default function UploadBookModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.epub')) {
        alert('Можно загружать только EPUB файлы');
        return;
      }
      setFile(selectedFile);
      setError('');
      
      if (!title) {
        const fileName = selectedFile.name.replace(/\.epub$/i, '');
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!file) {
      setError('Выберите файл');
      return;
    }
    
    if (!title.trim()) {
      setError('Введите название книги');
      return;
    }
    
    if (!author.trim()) {
      setError('Введите автора');
      return;
    }
    
    setLoading(true);
    try {
      await onUpload(file, title, author);
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Ошибка при загрузке книги');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-backdrop"></div>
      <div className="modal-container upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Загрузка книги</h3>
          <button onClick={onClose} className="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="modal-error">{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Файл EPUB</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".epub"
                onChange={handleFileChange}
                className="file-input-hidden"
                id="epub-file-input"
              />
              <div 
                className="file-input-display" 
                onClick={() => document.getElementById('epub-file-input')?.click()}
              >
                <span className="file-input-text">
                  {file ? file.name : 'Выберите файл...'}
                </span>
                <span className="file-input-browse">Обзор</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Название книги</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Автор</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Введите автора"
              className="form-input"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="form-button-cancel">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="form-button-submit">
              {loading ? 'Загрузка...' : 'Загрузить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}