import React, { useState, useEffect } from 'react';
import ReaderNote from './ReaderNote.jsx';
import ReaderModal from './ReaderModal.jsx';
import { getSoloNotes, getSoloQuotes } from '../../services/api';

export default function ReaderAside({ 
  showNoteModal, 
  onCloseNoteModal, 
  selectedText, 
  soloSessionId,
  onAddNote,
  onDeleteAnnotation,
  onAnnotationClick,
  onEditAnnotation
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
    } catch (err) {
      console.error(' Error deleting:', err);
      alert('Ошибка при удалении');
    }
  };

  const handleEdit = (id, type, currentColor, currentComment, selectedText) => {
  if (onEditAnnotation) {
    onEditAnnotation(id, type, currentColor, currentComment, selectedText);
  }
};

  const handleNoteClick = (id, startIndex) => {
    console.log(' Click on annotation:', id, 'startIndex:', startIndex);
    if (onAnnotationClick) {
      onAnnotationClick(id, startIndex);
    }
  };

  const filteredAnnotations = currentType === 'all' 
    ? annotations 
    : annotations.filter(a => a.type === currentType);

  if (loading) {
    return (
      <div className="max-w-[15vw] min-w-[15vw] flex flex-col bg-gray text-beige-1 h-full items-center justify-center sidebar-transition">
        <p>Загрузка аннотаций...</p>
      </div>
    );
  }

  // ← УДАЛИТЬ ЭТОТ БЛОК или исправить:
  // if (error) { ... }

  return (
    <div className="max-w-[15vw] min-w-[15vw] flex flex-col bg-gray text-beige-1 h-full sidebar-transition">
      <h2 className='px-2 ml-2 mt-4 text-lg'>Мои аннотации</h2>
      
      <select
        value={currentType}
        onChange={(e) => setType(e.target.value)}
        className="ml-2 mt-2 px-2 py-1 rounded-xl bg-accent-2 text-beige-1 focus:outline-none cursor-pointer"
      >
        <option value="all">Все</option>
        <option value="note">Заметки</option>
        <option value="quote">Цитаты</option>
      </select>

      <div className='flex-1 overflow-y-auto flex flex-col gap-3 mt-4 pb-4'>
        {filteredAnnotations.length === 0 ? (
          <p className="text-beige-1/70 text-sm text-center mt-10 px-2">
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