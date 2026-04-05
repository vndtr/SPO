import React, { useState, useEffect, useRef } from 'react';
import { getAnswersByNoteId } from '../../services/api';
import '../../styles/components/reader.css';
import '../../styles/components/annotations.css';

export default function SessionReaderNote({ 
  id, elementId, shouldOpenReplies, type, text, comment, color, author, visibility, start_index, end_index,
  currentUser, onDelete, onEdit, onReplyClick, 
  replyToNote, replyText, onReplyTextChange, onSubmitReply, onCancelReply, onNoteClick 
}) {
  const [showReplies, setShowReplies] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const hasOpenedRef = useRef(false);
  const isOwn = author?.id === currentUser?.user_id;
  const isTeacher = author?.role === 'teacher';
  const isReplyOpen = replyToNote?.id === id;

  useEffect(() => {
    if (showReplies && type === 'note') {
      loadAnswers();
    }
  }, [showReplies, id]);

  useEffect(() => {
    if (shouldOpenReplies && !hasOpenedRef.current && type === 'note') {
      hasOpenedRef.current = true;
      setShowReplies(true);
      if (answers.length === 0 && !loadingAnswers) {
        loadAnswers();
      }
    }
  }, [shouldOpenReplies, type]);

  const loadAnswers = async () => {
    setLoadingAnswers(true);
    try {
      const data = await getAnswersByNoteId(id);
      setAnswers(data);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setLoadingAnswers(false);
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

  const getBorderColorClass = () => {
    const colors = {
      yellow: 'reader-note-yellow',
      green: 'reader-note-green',
      blue: 'reader-note-blue',
      pink: 'reader-note-pink'
    };
    return colors[color] || 'reader-note-yellow';
  };

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    if (onNoteClick) onNoteClick(id, start_index);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(id, type, color, comment, text, visibility, start_index, end_index);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Удалить аннотацию?')) {
      onDelete(id, type);
    }
  };

  // Цитата
  if (type === 'quote') {
    return (
      <div className={`reader-note-quote ${getBgColorClass()}`} onClick={handleCardClick}>
        <div className="reader-note-header">
          <span className="reader-note-author">Цитата</span>
        </div>
        <p className="reader-note-quote-text">"{text}"</p>
        <div className="reader-note-actions">
          <div></div>
          <button onClick={handleDelete} className="reader-note-delete-btn" title="Удалить">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    window.refreshNoteAnswers = (noteId) => {
      if (noteId === id && showReplies) {
        loadAnswers();
      }
    };
    
    return () => {
      delete window.refreshNoteAnswers;
    };
  }, [id, showReplies]);

  // Заметка с ответами
  return (
    <div 
      id={elementId}
      className={`reader-note-card reader-note-${getBorderColorClass()}`}
      onClick={handleCardClick}
    >
      <div className="reader-note-header">
        <span className={`reader-note-author ${isTeacher ? 'reader-note-author-teacher' : ''}`}>
          {author?.name} {isTeacher ? '(Учитель)' : ''}
        </span>
        {isOwn && visibility && (
          <span className="reader-note-visibility">
            {visibility === 'public' ? 'Публичная' : 'Приватная'}
          </span>
        )}
      </div>

      <p className="reader-note-quote-text">"{text}"</p>
      <div className="reader-note-divider"></div>
      <p className="reader-note-comment">{comment}</p>

      <div className="reader-note-actions">
        <div className="flex gap-1">
          {visibility === 'public' && !isReplyOpen && (
            <button onClick={(e) => { e.stopPropagation(); onReplyClick(); }} className="reader-note-reply-btn">
              Ответить
            </button>
          )}
          
          {!isReplyOpen && (
            <button 
              onClick={(e) => { e.stopPropagation(); setShowReplies(!showReplies); }} 
              className="show-replies-button reader-note-reply-btn"
            >
              {showReplies ? 'Скрыть ответы' : 'Показать ответы'}
              {answers.length > 0 && ` (${answers.length})`}
            </button>
          )}
        </div>
        
        {isOwn && (
          <div className="flex gap-1">
            <button onClick={handleEdit} className="reader-note-edit-btn" title="Редактировать">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/>
              </svg>
            </button>
            <button onClick={handleDelete} className="reader-note-delete-btn" title="Удалить">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Форма ответа */}
      {isReplyOpen && (
        <form onSubmit={(e) => { e.preventDefault(); onSubmitReply(); }} className="reader-note-reply-form" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Введите ответ..."
            className="reader-note-reply-textarea"
            rows="2"
            autoFocus
          />
          <div className="reader-note-reply-actions">
            <button type="submit" className="reader-note-reply-submit">Отправить</button>
            <button type="button" onClick={onCancelReply} className="reader-note-reply-cancel">Отмена</button>
          </div>
        </form>
      )}

      {/* Древовидная структура ответов */}
      {showReplies && !isReplyOpen && (
        <div className="reader-note-replies">
          {loadingAnswers && <p className="reader-note-loading">Загрузка ответов...</p>}
          
          {!loadingAnswers && answers.length === 0 && (
            <p className="reader-note-no-answers">Нет ответов</p>
          )}
          
          {answers.map((answer) => (
            <div key={answer.id} className="reader-note-answer">
              <div className="reader-note-answer-header">
                <span className={`reader-note-answer-author ${answer.author?.role === 'teacher' ? 'reader-note-answer-author-teacher' : ''}`}>
                  {answer.author?.name || 'Пользователь'}
                  {answer.author?.role === 'teacher' && ' (Учитель)'}
                </span>
                <span className="reader-note-answer-time">
                  {new Date(answer.created_at).toLocaleString()}
                </span>
              </div>
              <p className="reader-note-answer-content">{answer.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}