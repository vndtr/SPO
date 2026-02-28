import React, { useState, useEffect } from 'react';
import ReaderNote from './ReaderNote.jsx';
import ReaderModal from './ReaderModal.jsx';

export default function ReaderAside({ 
    // Флаг открытия модального окна для создания заметки
    showNoteModal, 
    // Закрытие модального окна
    onCloseNoteModal, 
    // Текст, выделенный пользователем
    selectedText, 
    // Текущая страница (для совместимости)
    currentPage,
    // Создание новой заметки
    onAddNote,
    // Прокрутка к месту аннотации в тексте
    onAnnotationClick 
}) {
    
    // Выбранный тип для фильтрации
    const [currentType, setType] = useState('all');
    
    // Список заметок [id, note] из localStorage
    const [notes, setNotes] = useState([]);
    
    // Список цитат [id, quote] из localStorage
    const [quotes, setQuotes] = useState([]);

    //Загружает все аннотации из localStorage и обновляет состояния bспользуется при монтировании и после каждого обновления
    const loadAnnotations = () => {
        // заметки из личного хранилища
        const savedNotes = JSON.parse(localStorage.getItem('personal_notes')) || {};
        // Object.entries преобразует объект в массив [ключ, значение]
        setNotes(Object.entries(savedNotes));
        
        // цитаты из личного хранилища
        const savedQuotes = JSON.parse(localStorage.getItem('personal_quotes')) || {};
        setQuotes(Object.entries(savedQuotes));
    };
    
    // Удаляет аннотацию из localStorage и убирает подсветку из текста
    const handleDelete = (id, type) => {
        if (type === 'note') {
            // Удаляет заметку из объекта и сохраняем обратно
            const savedNotes = JSON.parse(localStorage.getItem('personal_notes')) || {};
            delete savedNotes[id];
            localStorage.setItem('personal_notes', JSON.stringify(savedNotes));
        } else {
            // Удаляет цитату из объекта и сохраняем обратно
            const savedQuotes = JSON.parse(localStorage.getItem('personal_quotes')) || {};
            delete savedQuotes[id];
            localStorage.setItem('personal_quotes', JSON.stringify(savedQuotes));
        }
        
        // Удаление подсветки из текста без перезагрузки страницы, вызов глобальной функции из SimpleTextReader
        if (window.removeHighlight) {
            window.removeHighlight(id);
        }
        // Перезагружаем список аннотаций в боковой панели
        loadAnnotations();
        // Уведомляем другие компоненты об обновлении
        window.dispatchEvent(new CustomEvent('personalAnnotationsUpdated'));
    };

    // заглушка
    const handleEdit = (id, type) => {
        console.log('Редактирование:', id, type);
        alert('Функция редактирования будет добавлена позже');
    };
    
    //Вызывается при клике на карточку аннотации,передаёт id аннотации в родительский компонент для прокрутки
    const handleNoteClick = (id) => {
        console.log('Клик по аннотации в личной панели, ID:', id);
        if (onAnnotationClick) {
            onAnnotationClick(id);
        }
    };
    
    useEffect(() => {
        // Первоначальная загрузка аннотаций
        loadAnnotations();

        // Подписка на кастомное событие обновления
        const handleUpdate = () => {
            loadAnnotations();
        };

        // слушатель события
        window.addEventListener('personalAnnotationsUpdated', handleUpdate);
        
        // Очищаем слушатель при размонтировании
        return () => window.removeEventListener('personalAnnotationsUpdated', handleUpdate);
    }, []); // Пустой массив зависимостей
    
    //Объединяет заметки и цитаты в один массив, добавляет поле type к каждому элементу, сортирует по времени создания (новые сверху)
    const allAnnotations = [
        ...notes.map(([key, value]) => ({ ...value, id: key, type: 'note' })),
        ...quotes.map(([key, value]) => ({ ...value, id: key, type: 'quote' }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Сортировка по убыванию времени
    
    //Фильтрация по типу
    const filteredAnnotations = currentType === 'all' 
        ? allAnnotations 
        : allAnnotations.filter(a => a.type === currentType);

    
    return (
        // Основной контейнер боковой панели
        <div className='
        max-w-[15vw] min-w-[15vw]           /* фиксированная ширина */
        flex flex-col bg-gray text-beige-1   /* фон и цвет текста */
        h-full'>                           
            
            <h2 className='px-2 ml-2 mt-4 text-lg'>Мои аннотации</h2>
            
            {/* Фильтрация */}
            <select
                value={currentType}
                onChange={(e) => setType(e.target.value)}
                className="ml-2 mt-2 px-2 py-1 rounded-xl bg-accent-2 text-beige-1
                        focus:outline-none focus:border-transparent
                        cursor-pointer"
            >
                <option value="all">Все</option>
                <option value="note">Заметки</option>
                <option value="quote">Цитаты</option>
            </select>

            {/* Список аннотаций */}
            <div className='flex-1 overflow-y-auto flex flex-col gap-3 mt-4 pb-4'>
                {filteredAnnotations.length === 0 ? (
                    // если аннотаций нет
                    <p className="text-beige-1/70 text-sm text-center mt-10 px-2">
                        Нет аннотаций<br/>
                        Выделите текст, чтобы создать цитату или заметку
                    </p>
                ) : (
                    // Отображаем каждую отдельную аннотацию через компонент ReaderNote
                    filteredAnnotations.map((annotation) => (
                        <ReaderNote 
                            key={annotation.id}                    // ключ
                            {...annotation}                        // передаём все поля аннотации
                            onDelete={handleDelete}                // функция удаления
                            onEdit={handleEdit}                    // функция редактирования
                            onNoteClick={handleNoteClick}          // функция прокрутки
                        />
                    ))
                )}
            </div>

            {/* Модалка для создания заметки */}
            {showNoteModal && (
                <ReaderModal
                    onClose={onCloseNoteModal}
                    selectedText={selectedText}
                    currentPage={currentPage}
                    onAddNote={onAddNote}
                />
            )}
        </div>
    );
}