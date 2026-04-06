import React from 'react';
import '../../styles/components/reader.css';
import '../../styles/components/annotations.css';

export default function ReaderNote({ 
  id, 
  type, 
  text, 
  comment, 
  color, 
  onDelete, 
  onEdit, 
  onNoteClick 
}) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Удалить аннотацию?')) {
      onDelete(id, type);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(id, type, color, comment, text);
  };
  
  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (onNoteClick) {
      onNoteClick(id);
    }
  };

  const getBgColorClass = () => {
    const colors = {
      yellow: 'reader-note-quote-yellow',
      green: 'reader-note-quote-green',
      blue: 'reader-note-quote-blue',
      pink: 'reader-note-quote-pink'
    };
    return colors[color] || 'reader-note-quote-yellow';
  };

  const getBorderColor = () => {
      const colors = {
    yellow: '#eab308',
    green: '#22c55e',
    blue: '#3b82f6',
    pink: '#ec4899'
  };
  return colors[color] || '#eab308';
};

  if (type === 'quote') {
    return (
      <div 
        className={`reader-note-quote ${getBgColorClass()}`}
        onClick={handleCardClick}
      >
        <div className="reader-note-header">
          <span className="reader-note-author">Цитата</span>
        </div>
        <p className="reader-note-quote-text">"{text}"</p>
        <div className="reader-note-actions">
          <div></div>
          <button 
            onClick={handleDelete}
            className="reader-note-delete-btn"
            title="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }
  
  return (
  <div 
    className="reader-note-card"
    style={{ 
      borderLeftColor: getBorderColor(), 
      borderLeftWidth: '4px', 
      borderLeftStyle: 'solid' 
    }}
    onClick={handleCardClick}
  >
      <div className="reader-note-header">
        <span className="reader-note-author">Заметка</span>
      </div>
      <p className="reader-note-quote-text">"{text}"</p>
      <div className="reader-note-divider"></div>
      <p className="reader-note-comment">{comment}</p>
      <div className="reader-note-actions">
        <div></div>
        <div className="flex gap-1">
          <button 
            onClick={handleEdit}
            className="reader-note-edit-btn"
            title="Редактировать"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/>
            </svg>
          </button>
          <button 
            onClick={handleDelete}
            className="reader-note-delete-btn"
            title="Удалить"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}