import React from 'react';
import deleteIcon from '../../assets/svg/delete_icon.svg';
import editIcon from '../../assets/svg/edit_icon.svg';

export default function ReaderNote({ 
    //  id нужен для удаления и прокрутки
    id, 
    // Тип аннотации: note или quote
    type, 
    // Выделенный текст, к которому относится аннотация
    text, 
    // Комментарий пользователя для заметок
    comment, 
    // Цвет
    color, 
    // Колбэки
    onDelete,   // удаление
    onEdit,     // редактирование
    onNoteClick // прокрутка к месту аннотации
}) {
    
    /**
     * Удаление аннотации
     * e.stopPropagation() предотвращает всплытие события к родительскому элементу,
     * чтобы клик по кнопке не вызывал прокрутку к аннотации
     */
    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Удалить аннотацию?')) {
            onDelete(id, type);
        }
    };

    //Редактирование аннотации показывает заглушку
    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit(id, type);
    };

    /**
     Клика по карточке аннотации
     Если клик не по кнопке, вызывается прокрутка к месту в тексте
     */
    const handleCardClick = (e) => {
        // Проверяем, не был ли клик по кнопке или внутри неё
        if (e.target.closest('button')) return;
        if (onNoteClick) {
            onNoteClick(id);
        }
    };

    // Определяет класс CSS для цвета подчёркивания заметки
    const getBorderColorClass = () => {
        const colorMap = {
            'yellow': 'border-yellow-300',
            'green': 'border-green-300',
            'blue': 'border-blue-300',
            'pink': 'border-pink-300'
        };
        return colorMap[color] || 'border-yellow-300';
    };

    //Рендеринг цитаты 
    if (type === 'quote') {
        // класс фона в зависимости от цвета
        const bgColorClass = {
            'yellow': 'bg-yellow-100',
            'green': 'bg-green-100',
            'blue': 'bg-blue-100',
            'pink': 'bg-pink-100'
        }[color] || 'bg-yellow-100';

        return (
            <div 
                //контейнер карточки
                className={`flex flex-col rounded-xl ${bgColorClass} text-blue p-3 mx-2 my-1 relative cursor-pointer hover:shadow-md transition-shadow`}
                onClick={handleCardClick}
            >
                {/* Блок с типом аннотации (вверху слева) */}
                <div className="mb-2">
                    <span className="text-xs bg-accent-1/20 text-accent-1 px-2 py-1 rounded-full">
                        Цитата
                    </span>
                </div>
                
                {/* Текст цитаты */}
                <p className='text-sm break-words leading-relaxed mb-8'>"{text}"</p>
                
                {/* Кнопки управления (в правом нижнем углу) */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <button 
                        onClick={handleEdit}
                        className="p-1.5 bg-beige-1 rounded hover:bg-accent-1/20 transition-colors"
                        title="Редактировать"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    
                    <button 
                        onClick={handleDelete}
                        className="p-1.5 bg-beige-1 rounded hover:bg-red-100 transition-colors"
                        title="Удалить"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    } 
    
    // Рендеринг заметки
    else {
        // класс цвета подчёркивания
        const borderColorClass = getBorderColorClass();

        return (
            <div 
                className={`flex flex-col rounded-xl bg-beige-1 text-blue p-3 mx-2 my-1 border-l-4 ${borderColorClass} relative cursor-pointer hover:shadow-md transition-shadow`}
                onClick={handleCardClick}
            >
                {/* Блок с типом аннотации */}
                <div className="mb-2">
                    <span className="text-xs bg-accent-1/20 text-accent-1 px-2 py-1 rounded-full">
                        Заметка
                    </span>
                </div>
                
                {/* Выделенный текст */}
                <p className='text-xs italic mb-2 leading-relaxed'>"{text}"</p>
                
                {/* Разделитель */}
                <div className='h-px bg-accent-1/20 my-2'></div>
                
                {/* Комментарий пользователя */}
                <p className='text-sm break-words leading-relaxed mb-8'>{comment}</p>
                
                {/* Кнопки управления (в правом нижнем углу) */}
                <div className="absolute bottom-2 right-2 flex gap-1">
                    <button 
                        onClick={handleEdit}
                        className="p-1.5 bg-beige-1 rounded hover:bg-accent-1/20 transition-colors"
                        title="Редактировать"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-1.5 bg-beige-1 rounded hover:bg-red-100 transition-colors"
                        title="Удалить"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}