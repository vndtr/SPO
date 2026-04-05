import React, { useState, useEffect, useRef } from 'react';
import { getAnswersByNoteId } from '../../services/api';

export default function SessionReaderNote({ 
  id, elementId,  shouldOpenReplies,  type, text, comment, color, author, visibility, start_index, end_index,
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

  // Загрузка ответов при разворачивании
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

  const getBorderColor = () => {
    const colors = { yellow: 'border-yellow-300', green: 'border-green-300', blue: 'border-blue-300', pink: 'border-pink-300' };
    return colors[color] || 'border-yellow-300';
  };

  const getBgColor = () => {
    const colors = { yellow: 'bg-yellow-100', green: 'bg-green-100', blue: 'bg-blue-100', pink: 'bg-pink-100' };
    return colors[color] || 'bg-yellow-100';
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
      <div className={`flex flex-col rounded-xl ${getBgColor()} text-blue p-3 mx-1 my-1 cursor-pointer hover:shadow-md transition-shadow`} onClick={handleCardClick}>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800">Цитата</span>
        </div>
        <p className='text-sm break-words leading-relaxed mb-3'>"{text}"</p>
        <div className="flex justify-end">
          <button onClick={handleDelete} className="p-1 hover:bg-red-100 rounded" title="Удалить">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
            </svg>
          </button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Глобальная функция для обновления ответов
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
        className={`flex flex-col rounded-xl bg-beige-1 text-blue p-3 mx-1 my-1 border-l-4 ${getBorderColor()} cursor-pointer hover:shadow-md transition-shadow`}
        onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-xs px-2 py-1 rounded-full ${isTeacher ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
          {author?.name} {isTeacher ? '(Учитель)' : ''}
        </span>
        {isOwn && visibility && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600">
            {visibility === 'public' ? 'Публичная' : 'Приватная'}
          </span>
        )}
      </div>

      <p className='text-xs italic mb-2'>"{text}"</p>
      <div className='h-px bg-accent-1/20 my-2'></div>
      <p className='text-sm break-words leading-relaxed mb-3'>{comment}</p>

      <div className="flex justify-between items-center">
    <div className="flex gap-1">
        {/* Кнопка "Ответить" — для публичных заметок (включая свои) */}
        {visibility === 'public' && !isReplyOpen && (
            <button onClick={(e) => { e.stopPropagation(); onReplyClick(); }} className="text-xs bg-accent-1/20 hover:bg-accent-1/40 text-accent-1 px-2 py-1 rounded">
                Ответить
            </button>
        )}
        
        {/* Кнопка показа/скрытия ответов */}
        {!isReplyOpen && (
            <button 
    onClick={(e) => { e.stopPropagation(); setShowReplies(!showReplies); }} 
    className="show-replies-button text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
>
    {showReplies ? 'Скрыть ответы' : 'Показать ответы'}
    {answers.length > 0 && ` (${answers.length})`}
</button>
        )}
    </div>
    
    {/* Кнопки редактирования и удаления — только для своих заметок */}
    {isOwn && (
        <div className="flex gap-1">
            <button onClick={handleEdit} className="p-1 hover:bg-accent-1/20 rounded" title="Редактировать">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/>
                </svg>
            </button>
            <button onClick={handleDelete} className="p-1 hover:bg-red-100 rounded" title="Удалить">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11z"/>
                </svg>
            </button>
        </div>
    )}
</div>

      {/* Форма ответа */}
      {isReplyOpen && (
        <form onSubmit={(e) => { e.preventDefault(); onSubmitReply(); }} className="mt-3" onClick={(e) => e.stopPropagation()}>
          <textarea
            value={replyText}
            onChange={(e) => onReplyTextChange(e.target.value)}
            placeholder="Введите ответ..."
            className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-1"
            rows="2"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button type="submit" className="text-xs bg-accent-1 text-beige-1 px-3 py-1.5 rounded">Отправить</button>
            <button type="button" onClick={onCancelReply} className="text-xs bg-gray-300 text-gray-700 px-3 py-1.5 rounded">Отмена</button>
          </div>
        </form>
      )}

      {/* Древовидная структура ответов */}
{showReplies && !isReplyOpen && (
    <div className="mt-3 pl-3 border-l-2 border-accent-1/30 space-y-2">
        {loadingAnswers && <p className="text-xs text-gray-500">Загрузка ответов...</p>}
        
        {!loadingAnswers && answers.length === 0 && (
            <p className="text-xs text-gray-500 italic">Нет ответов</p>
        )}
        
        {answers.map((answer) => (
            <div key={answer.id} className="bg-beige-2 rounded-lg p-2">
                <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium ${answer.author?.role === 'teacher' ? 'text-purple-600' : 'text-accent-1'}`}>
                        {answer.author?.name || 'Пользователь'}
                        {answer.author?.role === 'teacher' && ' (Учитель)'}
                    </span>
                    <span className="text-xs text-gray-400">
                        {new Date(answer.created_at).toLocaleString()}
                    </span>
                </div>
                <p className="text-sm mt-1 break-words">{answer.content}</p>
            </div>
        ))}
    </div>
)}
    </div>
  );
}