import React, { useState } from 'react';
import deleteIcon from '../../assets/svg/delete_icon.svg';
import editIcon from '../../assets/svg/edit_icon.svg';

export default function SessionReaderNote({ 

    id, 
    // Тип(note/quote)
    type, 
    // Выделенный текст
    text, 
    // Комментарий пользователя для заметок
    comment, 
    // Цвет
    color, 
    // Автор аннотации (объект с id, name, role)
    author,
    // Видимость public или private для заметок
    visibility,
    // Массив ответов для заметок
    replies = [],
    // Колбэки
    onDelete,        // удаление аннотации
    onEdit,          // редактирование
    onReplyClick,    // открыть форму ответа
    replyToNote,     // текущая заметка для ответа
    replyText,       // текст ответа
    onReplyTextChange, // изменение текста ответа
    onSubmitReply,   // отправка ответа
    onCancelReply,   // отмена ответа
    onNoteClick,     // прокрутка к месту в тексте
    currentUser      // текущий пользователь (учитель)
}) {
    
    // Показывать/скрывать ответы
    const [showReplies, setShowReplies] = useState(false);
    
    //Удаление аннотации e.stopPropagation() предотвращает всплытие к родительской карточке
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Удалить аннотацию?')) {
            onDelete(id, type);
        }
    };

    //Редактирование аннотации
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(id, type);
    };

    //Отправка ответа
    const handleReplySubmit = (e) => {
        e.preventDefault();
        onSubmitReply(id);
    };

    //Клик по карточке - прокручиваем к месту в тексте
    const handleCardClick = (e) => {
        if (e.target.closest('button')) return;
        if (onNoteClick) {
            onNoteClick(id);
        }
    };
    
    //Определяет, является ли текущий пользователь автором аннотации
    const isOwn = author?.id === currentUser?.id;
    
    //Проверяет, является ли автор учителем
    const isTeacher = author?.role === 'teacher';
    
    //Проверяет, является ли автором ученик
    const isStudent = author?.role === 'student';
    
    //Проверяет, открыта ли форма ответа для этой заметки
    const isReplyOpen = replyToNote?.id === id;

    //Форматирование даты 
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins} мин. назад`;
        if (diffHours < 24) return `${diffHours} ч. назад`;
        if (diffDays < 7) return `${diffDays} дн. назад`;
        return date.toLocaleDateString();
    };

    //цитаты
    if (type === 'quote') {
        // Определяем цвет фона 
        const bgColorClass = {
            'yellow': 'bg-yellow-100',
            'green': 'bg-green-100',
            'blue': 'bg-blue-100',
            'pink': 'bg-pink-100'
        }[color] || 'bg-yellow-100';

        return (
            <div 
                className={`flex flex-col rounded-xl ${bgColorClass} text-blue p-3 mx-1 my-1 relative cursor-pointer hover:shadow-md transition-shadow`}
                onClick={handleCardClick}
            >
                {/* Заголовок с автором */}
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        author?.role === 'teacher' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                    }`}>
                        {author?.role === 'teacher'} {author?.name}
                    </span>
                </div>
                
                {/* Текст цитаты */}
                <p className='text-sm break-words leading-relaxed mb-3'>"{text}"</p>
                
                {/* Дата и кнопки управления */}
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">
                        {formatDate(author?.timestamp)}
                    </span>
                    
                    {/* Кнопки редактирования/удаления */}
                    {isOwn && (
                        <div className="flex gap-1">
                            <button 
                                onClick={handleEdit}
                                className="p-1 bg-beige-1 rounded hover:bg-accent-1/20 transition-colors"
                                title="Редактировать"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="p-1 bg-beige-1 rounded hover:bg-red-100 transition-colors"
                                title="Удалить"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    //заметки
    // Определяем класс цвета для левой границы
    const borderColorClass = {
        'yellow': 'border-yellow-300',
        'green': 'border-green-300',
        'blue': 'border-blue-300',
        'pink': 'border-pink-300'
    }[color] || 'border-yellow-300';

    return (
        <div 
            className={`flex flex-col rounded-xl bg-beige-1 text-blue p-3 mx-1 my-1 border-l-4 ${borderColorClass} relative cursor-pointer hover:shadow-md transition-shadow`}
            onClick={handleCardClick}
        >
            {/* загаловок и автор */}
            <div className="flex justify-between items-start mb-2">
                {/* Имя автора */}
                <span className={`text-xs px-2 py-1 rounded-full ${
                    isTeacher ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'
                }`}>
                    {isTeacher} {author?.name}
                </span>
                
                {/* Статус приватности (только для своих заметок) */}
                {isOwn && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                        visibility === 'public' ? 'bg-purple-200 text-purple-800' : 'bg-purple-200 text-purple-800'
                    }`}>
                        {visibility === 'public' ? 'Публичная' : 'Приватная'}
                    </span>
                )}
            </div>

            {/* Заметка */}
            
            {/* Выделенный текст (курсивом) */}
            <p className='text-xs italic mb-2 leading-relaxed'>"{text}"</p>
            
            {/* Разделитель */}
            <div className='h-px bg-accent-1/20 my-2'></div>
            
            {/* Комментарий */}
            <p className='text-sm break-words leading-relaxed mb-3'>{comment}</p>
            
            {/* Дата создания */}
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-gray-500">
                    {formatDate(author?.timestamp)}
                </span>
                
                {/* Кнопки */}
                <div className="flex gap-1">
                    {/* Кнопка ответа для чужих публичных заметок */}
                    {!isOwn && isStudent && visibility === 'public' && !isReplyOpen && (
                        <button 
                            onClick={() => onReplyClick()}
                            className="text-xs bg-accent-1/20 hover:bg-accent-1/40 text-accent-1 px-2 py-1 rounded-full transition-colors"
                        >
                            Ответить
                        </button>
                    )}
                    
                    {/* Кнопки редактирования/удаления для своих заметок */}
                    {isOwn && (
                        <>
                            <button 
                                onClick={handleEdit}
                                className="p-1 bg-beige-1 rounded hover:bg-accent-1/20 transition-colors"
                                title="Редактировать"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                                </svg>
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="p-1 bg-beige-1 rounded hover:bg-red-100 transition-colors"
                                title="Удалить"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* форма ответа*/}
            {isReplyOpen && (
                <form onSubmit={handleReplySubmit} className="mt-3" onClick={(e) => e.stopPropagation()}>
                    <textarea
                        value={replyText}
                        onChange={(e) => onReplyTextChange(e.target.value)}
                        placeholder="Введите ответ..."
                        className="w-full p-2 text-xs border border-accent-1/30 rounded-lg focus:outline-none focus:ring-1 focus:ring-accent-1"
                        rows="2"
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <button 
                            type="submit"
                            className="text-xs bg-accent-1 text-beige-1 px-3 py-1.5 rounded hover:opacity-90"
                        >
                            Отправить
                        </button>
                        <button 
                            type="button"
                            onClick={onCancelReply}
                            className="text-xs bg-gray-300 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-400"
                        >
                            Отмена
                        </button>
                    </div>
                </form>
            )}

            {/* ответы */}
            {replies && replies.length > 0 && (
                <div className="mt-3 pt-2 border-t border-accent-1/20" onClick={(e) => e.stopPropagation()}>
                    <button 
                        onClick={() => setShowReplies(!showReplies)}
                        className="text-xs text-accent-1 hover:underline mb-2 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6L1 15l3.4-1.03C5.345 14.63 6.637 15 8 15z"/>
                        </svg>
                        {showReplies ? 'Скрыть ответы' : `Показать ответы (${replies.length})`}
                    </button>
                    
                    {showReplies && (
                        <div className="space-y-2">
                            {replies.map(reply => (
                                <div key={reply.id} className="bg-beige-2 p-2 rounded-lg text-xs">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`font-medium ${reply.author?.role === 'teacher' ? 'text-purple-600' : 'text-blue-600'}`}>
                                            {reply.author?.role === 'teacher'} {reply.author?.name}
                                        </span>
                                        <span className="text-gray-500 text-[10px]">
                                            {formatDate(reply.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{reply.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}