import React, { useState, useRef, useEffect } from 'react';
import ReaderHeader from '../components/readerComps/ReaderHeader.jsx';
import SessionReaderAside from '../components/readerComps/SessionReaderAside.jsx';
import SelectionMenu from '../components/readerComps/SelectionMenu.jsx';
import SimpleTextReader from '../utils/SimpleTextReader.jsx';

// Пользователь
const CURRENT_USER = {
    id: 'teacher-1',
    name: 'Лев Петров',
    role: 'teacher' 
};

export default function SessionReaderView() {

    // Управление видимостью меню выделения
    const [showMenu, setShowMenu] = useState(false);
    
    // Позиция меню на экране (рассчитывается из координат выделения)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
    
    // Выделенный текст
    const [selectedText, setSelectedText] = useState('');
    
    // Диапазон выделения в DOM (нужен для подсветки)
    const [selectedRange, setSelectedRange] = useState(null);
    
    // Открытие/закрытие модалки создания заметки
    const [showNoteModal, setShowNoteModal] = useState(false);
    
    // Текущая страница (для совместимости)
    const [currentPage, setCurrentPage] = useState(1);
    
    // Сохранение выделения перед открытием модалки, без этого выделение сбрасывается при открытии модалки
    const [pendingSelection, setPendingSelection] = useState(null);
    
    // Ссылка на DOM элемент меню (для определения кликов вне меню)
    const menuRef = useRef(null);

    
    //Вызывается из SimpleTextReader при выделении текста и сохраняет все данные о выделении 
    const handleTextSelected = (data) => {
        // Сохраняем диапазон для подсветки
        setSelectedRange(data.range);
        setSelectedText(data.text);
        
        // Сохраняем выделение в pending перед возможным открытием модалки
        setPendingSelection({
            range: data.range,
            text: data.text
        });
        
        // Устанавливаем позицию меню над выделением
        setMenuPosition({
            top: data.rect.top,
            left: data.rect.left,
            width: data.rect.width
        });
        
        // меню выбора действия
        setShowMenu(true);
    };
    //закрытие меню при клике вне него
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
                setPendingSelection(null);//очищаем сохранённое выделение
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    //Создаёт новую цитату с указанным цветом и сохраняет в отдельное хранилище для сессий (session_quotes)
    const handleQuote = (color, text) => {
        // генерация id 
        const quoteId = `quote-${Date.now()}`;
        
        // объект цитаты с информацией об авторе
        const newQuote = {
            id: quoteId,
            page: currentPage,
            text: text,
            color: color,
            type: 'quote',
            author: CURRENT_USER, 
            timestamp: new Date().toISOString()
        };
        
        // Сохранение в отдельное хранилище для сессий
        const savedQuotes = JSON.parse(localStorage.getItem('session_quotes')) || {};
        savedQuotes[quoteId] = newQuote;
        localStorage.setItem('session_quotes', JSON.stringify(savedQuotes));
        
        // Подсвечиваем выделенный текст
        if (window.highlightSelection && pendingSelection) {
            // Восстанавливаем выделение 
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(pendingSelection.range);
            
            // Вызываем глобальную функцию подсветки с указанием автора
            window.highlightSelection(color, 'quote', quoteId, CURRENT_USER);
        }
        
        // Сбрасываем состояния
        setShowMenu(false);
        setPendingSelection(null);
        
        // Уведомляем боковую панель об обновлении
        window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
    };

    //модалка заметки
    const openNoteModal = () => {
        setShowNoteModal(true);
        setShowMenu(false); // Закрываем меню выделения
    };
    
    //создание заметки с указанием цветв, комментария и статуса приватности
    const handleAddNote = (color, comment, visibility) => {
        console.log('Создание заметки в сессии:', color, comment, visibility);
        
        const noteId = `note-${Date.now()}`;
        
        //  объект заметки с поддержкой ответов
        const newNote = {
            id: noteId,
            text: selectedText,
            comment: comment,
            color: color,
            type: 'note',
            visibility: visibility,      
            author: CURRENT_USER,        
            replies: [],                  // массив для ответов
            timestamp: new Date().toISOString()
        };
        
        // сохранение в хранилище
        const savedNotes = JSON.parse(localStorage.getItem('session_notes')) || {};
        savedNotes[noteId] = newNote;
        localStorage.setItem('session_notes', JSON.stringify(savedNotes));
        
        // Подчеркиваем текст
        if (window.highlightSelection && pendingSelection) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(pendingSelection.range);
            window.highlightSelection(color, 'note', noteId, CURRENT_USER);
        }
        
        setPendingSelection(null);
        window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
    };

    //ответ к существующей заметке
    const handleAddReply = (noteId, replyText) => {
        console.log('Добавление ответа к заметке:', noteId, replyText);
        
        const reply = {
            id: `reply-${Date.now()}`,
            text: replyText,
            author: CURRENT_USER,  // сейчас от имени учителя
            timestamp: new Date().toISOString()
        };
        
        // Добавляем ответ
        const savedNotes = JSON.parse(localStorage.getItem('session_notes')) || {};
        if (savedNotes[noteId]) {
            if (!savedNotes[noteId].replies) {
                savedNotes[noteId].replies = [];
            }
            savedNotes[noteId].replies.push(reply);
            localStorage.setItem('session_notes', JSON.stringify(savedNotes));
        }
        
        window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
    };

    // прокрутка аннотации к ее месту в тексе при нажатии на аннотацию
    const handleAnnotationClick = (noteId) => {
        console.log('Клик по аннотации, ID:', noteId);
        if (window.scrollToAnnotation) {
            window.scrollToAnnotation(noteId);
        }
    };

    //заглушка 
    const handleEditAnnotation = (id, type) => {
        console.log('Редактирование аннотации:', id, type);
        alert('Функция редактирования будет добавлена позже');
    };

    //стили выделения и подчеркивания
    
    useEffect(() => {
        //Глобальные CSS стили для разных типов аннотации
        const style = document.createElement('style');
        style.textContent = `
            .highlighted-quote {
                cursor: pointer;
                transition: all 0.2s;
                border-radius: 2px;
            }
            .highlighted-quote:hover {
                opacity: 0.8;
            }
            .highlighted-note {
                cursor: pointer;
                transition: all 0.2s;
                background-color: transparent !important;
            }
            .own-note {
                border-bottom-width: 3px;
                border-bottom-style: solid;
            }
            .other-note {
                border-bottom: 2px dashed #9ca3af;
            }
            .highlighted-note:hover {
                opacity: 0.8;
            }
        `;
        document.head.appendChild(style);
        
        // Очистка при размонтировании
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className='relative h-screen flex flex-col'>
            {/* Шапка с параметром isSession={true} - режим сессии */}
            <ReaderHeader isSession={true} />
            
            <div className='flex flex-1 min-h-0'>
                {/* Боковая панель для сессии */}
                <SessionReaderAside 
                    showNoteModal={showNoteModal}
                    onCloseNoteModal={() => {
                        setShowNoteModal(false);
                        setPendingSelection(null);
                    }}
                    selectedText={selectedText}
                    currentPage={currentPage}
                    onAddNote={handleAddNote}
                    onAddReply={handleAddReply}
                    currentUser={CURRENT_USER}
                    onAnnotationClick={handleAnnotationClick}
                    onEditAnnotation={handleEditAnnotation}
                />

                {/* Область с текстом */}
                <main className="bg-beige-1 flex-1 p-10 overflow-y-auto">
                    <SimpleTextReader 
                        onTextSelected={handleTextSelected}
                        storagePrefix="session_"  //хранилище сессий
                        currentUser={CURRENT_USER} // Информация о текущем пользователе
                    />
                </main>
            </div>

            {/* Всплывающее меню при выделении текста */}
            {showMenu && (
                <SelectionMenu 
                    ref={menuRef}
                    position={menuPosition}
                    onClose={() => {
                        setShowMenu(false);
                        setPendingSelection(null);
                    }}
                    onQuote={handleQuote}
                    onNoteClick={openNoteModal}
                    selectedText={selectedText}
                />
            )}
        </div>
    );
}