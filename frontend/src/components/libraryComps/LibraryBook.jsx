import React from 'react';
import { Link } from 'react-router-dom';
import Progressbar from '../UI/Progressbar';
import { generateBookGradient } from '../../utils/bookCover';
import '../../styles/components/library.css';

export default function LibraryBook({ 
  id,  
  src, 
  title, 
  author, 
  progress,
  onDelete 
}) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Вы уверены, что хотите удалить эту книгу из библиотеки? Все заметки и цитаты будут также удалены.')) {
      console.log('Delete book:', id);  
      onDelete(id);  
    }
  };

  //градиент на основе названия
  const coverStyle = {
    backgroundImage: generateBookGradient(title),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div className="library-book" style={coverStyle}>
      <div className="book-overlay" />
      <div className="book-dark-overlay" />

      <div className="book-content">
        <h2 className="book-title">{title || 'Без названия'}</h2>
        <h3 className="book-author">{author || 'Неизвестный автор'}</h3>
        
        <div className="book-progress">
          <Progressbar progress={progress || 0} />
        </div>

        <div className="book-actions">
          <Link to={`/reader?bookId=${id}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`}>
            <button className="book-button book-button-open">
              Открыть
            </button>
          </Link>
          <Link to={`/session-create?bookId=${id}`}>
            <button className="book-button book-button-session">
              Сессия
            </button>
          </Link>
        </div>

        <button 
          onClick={handleDelete}
          className="book-delete"
          aria-label="Удалить книгу"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}