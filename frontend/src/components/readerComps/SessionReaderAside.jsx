import React, { useState, useEffect } from 'react';
import SessionReaderNote from './SessionReaderNote.jsx';
import SessionReaderModal from './SessionReaderModal.jsx';
import { getSessionAnnotations } from '../../services/api';
import '../../styles/components/reader.css';

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
  onEditAnnotation,
  highlightedNoteId = null
}) {
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [annotations, setAnnotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [replyToNote, setReplyToNote] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAnnotations = async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const data = await getSessionAnnotations(sessionId);
      
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

      const uniqueUsers = new Map();
      notes.forEach(note => {
        if (note.author && !uniqueUsers.has(note.author.id)) {
          const isTeacher = note.author.role === 'teacher';
          const isCurrentUser = note.author.id === currentUser?.user_id;
          
          if (userRole === 'student') {
            if (isTeacher || isCurrentUser) {
              uniqueUsers.set(note.author.id, note.author);
            }
          } else if (userRole === 'teacher') {
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

  useEffect(() => {
    const handleForceReload = () => {
      loadAnnotations();
    };
    
    window.addEventListener('forceReloadAnnotations', handleForceReload);
    return () => window.removeEventListener('forceReloadAnnotations', handleForceReload);
  }, [sessionId]);

  useEffect(() => {
    window.openNoteReplies = (noteId) => {
      const noteComponent = document.getElementById(`note-${noteId}`);
      if (noteComponent) {
        const showRepliesButton = noteComponent.querySelector('.show-replies-button');
        if (showRepliesButton) {
          showRepliesButton.click();
        }
      }
    };
    
    return () => {
      delete window.openNoteReplies;
    };
  }, []);

  const filteredAnnotations = annotations.filter(ann => {
    if (filterType !== 'all' && ann.type !== filterType) {
      return false;
    }
    
    if (filterUser !== 'all') {
      const selectedUserId = parseInt(filterUser);
      
      if (ann.type === 'quote') {
        const isCurrentUser = selectedUserId === currentUser?.user_id;
        return isCurrentUser;
      }
      
      const match = ann.author?.id === selectedUserId;
      if (!match) return false;
    }
    
    if (filterUser === 'all') {
      if (ann.type === 'quote') {
        return true;
      }
      
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
      <div className="reader-aside">
        <div className="reader-aside-loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="reader-aside">
      <h2 className="reader-aside-title">Аннотации</h2>
      
      <div className="reader-aside-filter">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="reader-aside-select"
        >
          <option  value="all">Все типы</option>
          <option value="note">Только заметки</option>
          <option value="quote">Только цитаты</option>
        </select>

        {users.length > 0 && (
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="reader-aside-select"
            style={{ marginTop: '0.5rem' }}
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

      <div className="reader-aside-annotations">
        {filteredAnnotations.length === 0 ? (
          <p className="reader-aside-empty">
            Нет аннотаций<br/>
            Выделите текст, чтобы создать цитату или заметку
          </p>
        ) : (
          filteredAnnotations.map((ann, index) => {
            if (ann.type === 'quote') {
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
              const isReplyOpen = replyToNote?.id === ann.id;
              return (
                <SessionReaderNote 
                  key={`${ann.id}_${index}`}
                  id={ann.id}
                  elementId={`note-${ann.id}`}
                  shouldOpenReplies={highlightedNoteId === ann.id}
                  type={ann.type}
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
                  onEdit={onEditAnnotation}
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