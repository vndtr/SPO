import React, { useState, useEffect } from 'react';
import SessionReaderNote from './SessionReaderNote.jsx';
import SessionReaderModal from './SessionReaderModal.jsx';

//пользователи для демонстрации
const DEMO_USERS = {
    teacher: {
        id: 'teacher-1',
        name: 'Лев Петров',
        role: 'teacher'
    },
    student1: {
        id: 'student-1',
        name: 'Гольскун',
        role: 'student'
    },
    student2: {
        id: 'student-2',
        name: 'Галактион',
        role: 'student'
    }
};

// Заметки для демонстрации
const DEMO_NOTES = {
    // Публичная заметка 
    'note-demo-1': {
        id: 'note-demo-1',
        page: 3,
        text: 'свою приличную шляпу пирожком нес в руке',
        comment: 'Почему именно "пирожком"? ',
        color: 'yellow',
        type: 'note',
        visibility: 'public',
        author: DEMO_USERS.student1,
        replies: [],
        timestamp: new Date(Date.now() - 86400000).toISOString()
    },
    // Публичная заметка 
    'note-demo-2': {
        id: 'note-demo-2',
        page: 5,
        text: 'Кого оторвали от плуга, от привычных серых картин',
        comment: ' Лошадь тоже тоскует по дому, как и Иона.',
        color: 'green',
        type: 'note',
        visibility: 'public',
        author: DEMO_USERS.student2,
        replies: [
            {
                id: 'reply-demo-1',
                text: ' Действительно, Чехов проводит параллель между человеком и животным.',
                author: DEMO_USERS.teacher,
                timestamp: new Date(Date.now() - 43200000).toISOString()
            }
        ],
        timestamp: new Date(Date.now() - 172800000).toISOString()
    },
    // Публичная заметка 
    'note-demo-4': {
        id: 'note-demo-4',
        page: 12,
        text: 'сын на этой неделе помер',
        comment: ' Почему Чехов показывает это именно в начале рассказа?',
        color: 'pink',
        type: 'note',
        visibility: 'public',
        author: DEMO_USERS.student2,
        replies: [],
        timestamp: new Date(Date.now() - 7200000).toISOString()
    }
};

export default function SessionReaderAside({ 
    showNoteModal, 
   onCloseNoteModal, 
    selectedText, // выделенный текст
    currentPage,// текущая страница
    onAddNote,// создание заметки
    onAddReply,// добавление ответа
    currentUser, // текущий пользователь (учитель)    
    onAnnotationClick// Прокрутка к месту аннотации в тексте
}) {
    //состояния
    const [filterType, setFilterType] = useState('all');
    const [filterUser, setFilterUser] = useState('all');
    const [notes, setNotes] = useState([]);
    const [quotes, setQuotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [replyToNote, setReplyToNote] = useState(null);
    const [replyText, setReplyText] = useState('');

    // Принудительная загрузка данных для демонстрации
    useEffect(() => {
        console.log('Инициализация демо-данных сессии');
        localStorage.setItem('session_notes', JSON.stringify(DEMO_NOTES));
        
        loadAnnotations();
    }, []);

    // Загрузка данных с фильтрацией по видимости
    const loadAnnotations = () => {
        console.log('Загрузка аннотаций сессии');
        
        const savedNotes = JSON.parse(localStorage.getItem('session_notes')) || {};
        const savedQuotes = JSON.parse(localStorage.getItem('session_quotes')) || {};
        
        // Фильтруем заметки по видимости
        const filteredNotes = Object.entries(savedNotes).filter(([_, note]) => {
            // Свои заметки видит всегда
            if (note.author.id === currentUser.id) return true;
            // Чужие заметки видит только если они публичные
            if (note.visibility === 'public') return true;
            // Приватные чужие не видит
            return false;
        });
        
        // Цитаты  видны только автору
        const filteredQuotes = Object.entries(savedQuotes).filter(([_, quote]) => {
            return quote.author.id === currentUser.id;
        });
        
        console.log('Заметок после фильтрации:', filteredNotes.length);
        console.log('Цитат после фильтрации:', filteredQuotes.length);
        
        setNotes(filteredNotes);
        setQuotes(filteredQuotes);
        
        // Собираем уникальных пользователей (только те, чьи заметки видны)
        const allAuthors = new Set();
        
        filteredNotes.forEach(([_, note]) => {
            if (note.author) allAuthors.add(note.author.id);
        });
        
        filteredQuotes.forEach(([_, quote]) => {
            if (quote.author) allAuthors.add(quote.author.id);
        });
        
        const usersList = Array.from(allAuthors).map(id => {
            const note = filteredNotes.find(([_, n]) => n.author?.id === id)?.[1];
            const quote = filteredQuotes.find(([_, q]) => q.author?.id === id)?.[1];
            return note?.author || quote?.author || { id, name: 'Пользователь', role: 'student' };
        });
        
        setUsers(usersList);
    };

    // Удаление аннотации
    const handleDelete = (id, type) => {
        if (type === 'note') {
            const savedNotes = JSON.parse(localStorage.getItem('session_notes')) || {};
            delete savedNotes[id];
            localStorage.setItem('session_notes', JSON.stringify(savedNotes));
        } else {
            const savedQuotes = JSON.parse(localStorage.getItem('session_quotes')) || {};
            delete savedQuotes[id];
            localStorage.setItem('session_quotes', JSON.stringify(savedQuotes));
        }
        
        if (window.removeHighlight) {
            window.removeHighlight(id);
        }
        
        loadAnnotations();
        window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
    };

    // Отправка ответа
    const handleSubmitReply = (noteId) => {
        if (replyText.trim()) {
            onAddReply(noteId, replyText); // вызов из SessionReaderView
            setReplyText('');// очистка поля
            setReplyToNote(null); // закрытие формы
            loadAnnotations();  // обновление списка
        }
    };

    // Отмена ответа
    const handleCancelReply = () => {
        setReplyToNote(null);
        setReplyText('');
    };

    //Вызывается при клике на карточку аннотации,передаёт id аннотации в родительский компонент для прокрутки
    const  handleNoteClick  = (id) => {
        console.log('Клик по аннотации в личной панели, ID:', id);
        if (onAnnotationClick) {
            onAnnotationClick(id);
        }
    };

    // обновления
    useEffect(() => {
        const handleUpdate = () => {
            console.log('Обновление аннотаций');
            loadAnnotations();
        };

        window.addEventListener('sessionAnnotationsUpdated', handleUpdate);
        return () => window.removeEventListener('sessionAnnotationsUpdated', handleUpdate);
    }, [currentUser]);

    // Объединяем и сортируем
    const allAnnotations = [
        ...notes.map(([key, value]) => ({ ...value, id: key, type: 'note' })),
        ...quotes.map(([key, value]) => ({ ...value, id: key, type: 'quote' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Фильтруем по выбранным фильтрам
    const filteredAnnotations = allAnnotations.filter(annotation => {
        if (filterType !== 'all' && annotation.type !== filterType) return false;
        if (filterUser !== 'all' && annotation.author?.id !== filterUser) return false;
        return true;
    });

    return (
        <div className='
        max-w-[15vw] min-w-[15vw]
        flex flex-col bg-gray text-beige-1 h-full'>
            <h2 className='px-2 ml-2 mt-4 text-lg'>Аннотации сессии</h2>
            
            {/* Фильтры */}
            <div className="px-2 mt-2 space-y-2">
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-2 py-1 rounded-xl bg-accent-2 text-beige-1
                            focus:outline-none focus:border-transparent cursor-pointer"
                >
                    <option value="all">Все типы</option>
                    <option value="note">Только заметки</option>
                    <option value="quote">Только цитаты</option>
                </select>

                <select
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    className="w-full px-2 py-1 rounded-xl bg-accent-2 text-beige-1
                            focus:outline-none focus:border-transparent cursor-pointer"
                >
                    <option value="all">Все пользователи</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} {user.role === 'teacher' }
                        </option>
                    ))}
                </select>
            </div>

            {/* Список аннотаций */}
            <div className='flex-1 overflow-y-auto flex flex-col gap-3 mt-4 pb-4 px-2'>
                {filteredAnnotations.length === 0 ? (
                    <p className="text-beige-1/70 text-sm text-center mt-10">
                        Нет аннотаций
                    </p>
                ) : (
                    filteredAnnotations.map((annotation) => (
                        <SessionReaderNote 
                            key={annotation.id} 
                            {...annotation} 
                            onDelete={handleDelete}
                            onReplyClick={() => setReplyToNote(annotation)}
                            replyToNote={replyToNote}
                            replyText={replyText}
                            onReplyTextChange={setReplyText}
                            onSubmitReply={handleSubmitReply}
                            onCancelReply={handleCancelReply}
                            currentUser={currentUser}
                            onNoteClick={handleNoteClick}
                        />
                    ))
                )}
            </div>

            {/* Модальное окно для заметки */}
            {showNoteModal && (
                <SessionReaderModal
                    onClose={onCloseNoteModal}
                    selectedText={selectedText}
                    currentPage={currentPage}
                    onAddNote={onAddNote}
                />
            )}
        </div>
    );
}