// frontend/src/components/readerComps/SessionReaderAside.jsx
import React, { useState, useEffect } from 'react';
import SessionReaderNote from './SessionReaderNote.jsx';
import SessionReaderModal from './SessionReaderModal.jsx';
import { getSessionAnnotations } from '../../services/api';

export default function SessionReaderAside({ 
  showNoteModal, 
  onCloseNoteModal, 
  selectedText, 
  sessionId,
  onAddNote,
  onAddReply,
  onDeleteAnnotation,
  onAnnotationClick,
  currentUser,
  userRole,
  onEditAnnotation
}) {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [annotations, setAnnotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [replyToNote, setReplyToNote] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  // Загрузка аннотаций
  const loadAnnotations = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const data = await getSessionAnnotations(sessionId);
      
      // Обрабатываем заметки - добавляем author
      const notes = (data.notes || []).map(n => ({ 
        ...n, 
        type: 'note',
        author_id: n.author_id,
        author: { 
          id: n.author_id, 
          name: n.author_name, 
          role: n.author_role 
        }
      }));
      
      // Цитаты - без автора
      const quotes = (data.quotes || []).map(q => ({ 
        ...q, 
        type: 'quote',
        author: null
      }));
      
      const allAnnotations = [...notes, ...quotes].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
      setAnnotations(allAnnotations);

      setTimeout(() => {
            if (window.refreshAllHighlights) {
                
                window.refreshAllHighlights();
            }
        }, 200);

      

      // Собираем пользователей для фильтрации
const uniqueUsers = new Map();

notes.forEach(note => {
    if (note.author && !uniqueUsers.has(note.author.id)) {
        const isTeacher = note.author.role === 'teacher';
        const isCurrentUser = note.author.id === currentUser?.user_id;
        
        // Для ученика: добавляем только учителей и себя
        if (userRole === 'student') {
            if (isTeacher || isCurrentUser) {
                uniqueUsers.set(note.author.id, note.author);
            }
        } 
        // Для учителя: добавляем всех пользователей
        else if (userRole === 'teacher') {
            uniqueUsers.set(note.author.id, note.author);
        }
    }
});

setUsers(Array.from(uniqueUsers.values()));
      
    } catch (err) {
      console.error('Error loading annotations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnotations();
  }, [sessionId]);

  // Обновление при событиях
  useEffect(() => {
    const handleUpdate = () => {
      loadAnnotations();
    };
    
    window.addEventListener('sessionAnnotationsUpdated', handleUpdate);
    return () => window.removeEventListener('sessionAnnotationsUpdated', handleUpdate);
  }, [sessionId]);

  const handleReplyClick = (note) => {
    setReplyToNote(note);
    setReplyText('');
  };

  const handleEdit = (id, type, currentColor, currentComment, selectedText, visibility, startIndex, endIndex) => {
    if (onEditAnnotation) {
      onEditAnnotation(id, type, currentColor, currentComment, selectedText, visibility, startIndex, endIndex);
    }
  };

  const handleSubmitReply = () => {
    if (replyText.trim() && replyToNote) {
      onAddReply(replyToNote.id, replyText);
      setReplyText('');
      setReplyToNote(null);
    }
  };

  const handleCancelReply = () => {
    setReplyToNote(null);
    setReplyText('');
  };

  // Добавьте этот useEffect в SessionReaderAside.jsx, рядом с существующим

useEffect(() => {
    const handleForceReload = () => {
        loadAnnotations();
    };
    
    window.addEventListener('forceReloadAnnotations', handleForceReload);
    return () => window.removeEventListener('forceReloadAnnotations', handleForceReload);
}, [sessionId]);

const filteredAnnotations = annotations.filter(ann => {
    // 1. Сначала фильтр по типу
    if (filterType !== 'all' && ann.type !== filterType) {
        return false;
    }
    
    // 2. Если фильтруем по конкретному пользователю
    if (filterUser !== 'all') {
        const selectedUserId = parseInt(filterUser);
        
        // Для цитат: показываем только если фильтр по текущему пользователю
        if (ann.type === 'quote') {
            const isCurrentUser = selectedUserId === currentUser?.user_id;
            return isCurrentUser;
        }
        
        // Для заметок: проверяем соответствие автору
        const match = ann.author?.id === selectedUserId;
        if (!match) return false;
    }
    
    // 3. Если filterUser === 'all' (показываем всё)
    if (filterUser === 'all') {
        // Цитаты показываем всегда
        if (ann.type === 'quote') {
            return true;
        }
        
        // Для заметок проверяем видимость в зависимости от роли
        if (userRole === 'student') {
            const isOwn = ann.author?.id === currentUser?.user_id;
            const isTeacher = ann.author?.role === 'teacher';
            if (!isOwn && !isTeacher) return false;
        }
    }
    
    return true;
});


  if (loading) {
    return (
      <div className="max-w-[15vw] min-w-[15vw] flex flex-col bg-gray text-beige-1 h-full items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[15vw] min-w-[15vw] flex flex-col bg-gray text-beige-1 h-full">
      <h2 className='px-2 ml-2 mt-4 text-lg'>Аннотации</h2>
      
      {/* Фильтры */}
      <div className="px-2 mt-2 space-y-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-full px-2 py-1 rounded-xl bg-accent-2 text-beige-1 cursor-pointer"
        >
          <option value="all">Все типы</option>
          <option value="note">Только заметки</option>
          <option value="quote">Только цитаты</option>
        </select>

        {users.length > 0 && (
    <select
        value={filterUser}
        onChange={(e) => setFilterUser(e.target.value)}
        className="w-full px-2 py-1 rounded-xl bg-accent-2 text-beige-1 cursor-pointer"
    >
        <option value="all">Все пользователи</option>
        {users.map(user => (
            <option key={user.id} value={user.id}>
                {user.name} {user.id === currentUser?.user_id ? '(Вы)' : ''} {user.role === 'teacher' ? '(Учитель)' : ''}
            </option>
        ))}
    </select>
)}
      </div>

      {/* Список аннотаций */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 mt-4 pb-4 px-2">
        {filteredAnnotations.length === 0 ? (
          <p className="text-beige-1/70 text-sm text-center mt-10">
            Нет аннотаций<br/>
            Выделите текст, чтобы создать цитату или заметку
          </p>
        ) : (
          filteredAnnotations.map((ann, index) => {
            if (ann.type === 'quote') {
              // Цитата — без автора, без ответа, без редактирования
              return (
                <SessionReaderNote 
                  key={`${ann.id}_quote_${index}`}
                  id={ann.id}
                  type="quote"
                  text={ann.selected_text}
                  color={ann.color}
                  start_index={ann.start_index}
                  end_index={ann.end_index}
                  currentUser={currentUser}
                  onDelete={onDeleteAnnotation}
                  onNoteClick={() => onAnnotationClick(ann.id, ann.start_index)}
                />
              );
            } else {
              // Заметка — с автором, с ответами, с редактированием
              const isReplyOpen = replyToNote?.id === ann.id;
              return (
                <SessionReaderNote 
    key={`${ann.id}_note_${index}`}
    id={ann.id}
    type="note"
    text={ann.selected_text}
    comment={ann.comment}
    color={ann.color}
    author={{ 
        id: ann.author_id, 
        name: ann.author_name, 
        role: ann.author_role 
    }}
    visibility={ann.is_private ? 'private' : 'public'}
    start_index={ann.start_index}
    end_index={ann.end_index}
    currentUser={currentUser}
    onDelete={onDeleteAnnotation}
    onEdit={(id, type, color, comment, text, visibility, startIndex, endIndex) => 
        onEditAnnotation(id, type, color, comment, text, visibility, startIndex, endIndex)
    }
    onReplyClick={() => handleReplyClick(ann)}
    replyToNote={replyToNote}
    replyText={replyText}
    onReplyTextChange={setReplyText}
    onSubmitReply={handleSubmitReply}
    onCancelReply={handleCancelReply}
    onNoteClick={() => onAnnotationClick(ann.id, ann.start_index)}
    isReplyOpen={replyToNote?.id === ann.id}
/>
              );
            }
          })
        )}
      </div>

      {/* Модалка для создания заметки */}
      {showNoteModal && (
        <SessionReaderModal
          onClose={onCloseNoteModal}
          selectedText={selectedText}
          onAddNote={onAddNote}
        />
      )}
    </div>
  );
}