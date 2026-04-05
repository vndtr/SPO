import React, { useState, useEffect } from 'react';
import ReaderNote from './ReaderNote.jsx';
import ReaderModal from './ReaderModal.jsx';
import { getSoloNotes, getSoloQuotes } from '../../services/api';
import '../../styles/components/reader.css';

export default function ReaderAside({ 
  showNoteModal, 
  onCloseNoteModal, 
  selectedText, 
  soloSessionId,
  onAddNote,
  onDeleteAnnotation,
  onAnnotationClick,
  onEditAnnotation,
  isSidebarOpen = true 
}) {
  const [currentType, setType] = useState('all');
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAnnotations = async () => {
    if (!soloSessionId) return;
    
    try {
      setLoading(true);
      const notes = await getSoloNotes(soloSessionId);
      const quotes = await getSoloQuotes(soloSessionId);
      
      const allAnnotations = [
        ...notes.map(n => ({ ...n, type: 'note' })),
        ...quotes.map(q => ({ ...q, type: 'quote' }))
      ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      setAnnotations(allAnnotations);
    } catch (err) {
      console.error('Error loading annotations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnotations();
    
    const handleUpdate = () => {
      loadAnnotations();
    };
    
    window.addEventListener('personalAnnotationsUpdated', handleUpdate);
    return () => window.removeEventListener('personalAnnotationsUpdated', handleUpdate);
  }, [soloSessionId]);

  const handleDelete = async (id, type) => {
    if (!window.confirm('Удалить аннотацию?')) return;
    
    try {
      await onDeleteAnnotation(id, type);
      loadAnnotations();
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Ошибка при удалении');
    }
  };

  const handleEdit = (id, type, currentColor, currentComment, selectedText) => {
    if (onEditAnnotation) {
      onEditAnnotation(id, type, currentColor, currentComment, selectedText);
    }
  };

  const handleNoteClick = (id, startIndex) => {
    if (onAnnotationClick) {
      onAnnotationClick(id, startIndex);
    }
  };

  const filteredAnnotations = currentType === 'all' 
    ? annotations 
    : annotations.filter(a => a.type === currentType);

  if (loading) {
    return (
      <div className={`reader-aside ${!isSidebarOpen ? 'reader-aside-hidden' : ''}`}>
        <div className="reader-aside-loading">Загрузка аннотаций...</div>
      </div>
    );
  }

  return (
    <div className={`reader-aside ${!isSidebarOpen ? 'reader-aside-hidden' : ''}`}>
      <h2 className="reader-aside-title">Мои аннотации</h2>
      
      <div className="reader-aside-filter">
        <select
          value={currentType}
          onChange={(e) => setType(e.target.value)}
          className="reader-aside-select"
        >
          <option value="all">Все</option>
          <option value="note">Заметки</option>
          <option value="quote">Цитаты</option>
        </select>
      </div>

      <div className="reader-aside-annotations">
        {filteredAnnotations.length === 0 ? (
          <p className="reader-aside-empty">
            Нет аннотаций<br/>
            Выделите текст в книге, чтобы создать цитату или заметку
          </p>
        ) : (
          filteredAnnotations.map((annotation) => (
            <ReaderNote 
              key={`${annotation.id}_${annotation.type}`}
              id={annotation.id}
              type={annotation.type}
              text={annotation.selected_text}
              comment={annotation.comment}
              color={annotation.color}
              start_index={annotation.start_index}
              onDelete={handleDelete}
              onEdit={(id, type, color, comment, text) => handleEdit(id, type, color, comment, text)}
              onNoteClick={() => handleNoteClick(annotation.id, annotation.start_index)}
            />
          ))
        )}
      </div>

      {showNoteModal && (
        <ReaderModal
          onClose={onCloseNoteModal}
          selectedText={selectedText}
          onAddNote={onAddNote}
        />
      )}
    </div>
  );
}