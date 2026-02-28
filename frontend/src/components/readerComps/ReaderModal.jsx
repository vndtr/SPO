import { useState } from "react"

export default function ReaderModal({ 
    onClose,           // функция закрытия модального окна
    selectedText,      // выделенный текст
    currentPage,       // текущая страница (для совместимости)
    onAddNote          // функция создания заметки
}) { 
    // комментарий
    const [comment, setComment] = useState('');
    
    // Выбранный цвет подчёркивания (по умолчанию жёлтый)
    const [color, setColor] = useState('yellow');

    
    const addNote = () => {
        // Проверяем, что комментарий не пустой
        if (!comment.trim()) return;
        
        // Вызываем функцию из родительского компонента
        onAddNote(color, comment);
        
        // Закрываем модальное окно
        onClose();
    };

    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            
            {/* Контейнер с содержимым модального окна */}
            <div className="bg-beige-1 p-6 rounded-2xl max-w-lg w-full text-blue flex flex-col gap-4 border border-accent-1">
                
                {/* Заголовок */}
                <h3 className="text-xl font-medium">Новая заметка</h3>
                
                {/* выделенный текст книги */}
                <div className="bg-beige-2 p-4 rounded-xl border border-accent-1/30">
                    <p className="text-sm text-gray-600 mb-1">Выделенный текст:</p>
                    <p className="text-blue italic bg-white p-2 rounded">"{selectedText}"</p>
                </div>
                
                {/* ввод комментария */}
                <textarea
                    placeholder="Ваш комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="border border-accent-1/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-1 w-full"
                    autoFocus
                />

                {/* выбор цвета */}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Цвет подчеркивания:</span>
                    <div className="flex gap-3">
                        {/* Жёлтый */}
                        <button 
                            className={`w-10 h-10 rounded-full bg-yellow-300 border-2 transition-all ${
                                color === 'yellow' 
                                    ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' 
                                    : 'border-transparent hover:scale-105'
                            }`}
                            onClick={() => setColor('yellow')}
                        />
                        
                        {/* Зелёный */}
                        <button 
                            className={`w-10 h-10 rounded-full bg-green-300 border-2 transition-all ${
                                color === 'green' 
                                    ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' 
                                    : 'border-transparent hover:scale-105'
                            }`}
                            onClick={() => setColor('green')}
                        />
                        
                        {/* Синий */}
                        <button 
                            className={`w-10 h-10 rounded-full bg-blue-300 border-2 transition-all ${
                                color === 'blue' 
                                    ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' 
                                    : 'border-transparent hover:scale-105'
                            }`}
                            onClick={() => setColor('blue')}
                        />
                        
                        {/* Розовый */}
                        <button 
                            className={`w-10 h-10 rounded-full bg-pink-300 border-2 transition-all ${
                                color === 'pink' 
                                    ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' 
                                    : 'border-transparent hover:scale-105'
                            }`}
                            onClick={() => setColor('pink')}
                        />
                    </div>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                    {/* Кнопка сохранения */}
                    <button 
                        onClick={addNote} 
                        className="bg-accent-1 text-beige-1 rounded-xl px-6 py-2 hover:opacity-90 transition font-medium"
                    >
                        Сохранить заметку
                    </button>
                    
                    {/* Кнопка отмены */}
                    <button 
                        onClick={onClose} 
                        className="border border-accent-1 text-accent-1 rounded-xl px-6 py-2 hover:bg-accent-1/10 transition font-medium"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}