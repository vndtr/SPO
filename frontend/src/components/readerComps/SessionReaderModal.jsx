import { useState } from "react"

export default function SessionReaderModal({ 
    onClose,           // функция закрытия
    selectedText,      // выделенный текст
    onAddNote          // функция создания заметки с видимостью
}) {
    
    const [comment, setComment] = useState('');
    const [color, setColor] = useState('yellow');
    const [visibility, setVisibility] = useState('private'); // public/private
    
    const addNote = () => {
        if (!comment.trim()) return;
        // Передаём цвет, комментарий и видимость
        onAddNote(color, comment, visibility);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-beige-1 p-6 rounded-2xl max-w-lg w-full text-blue flex flex-col gap-4 border border-accent-1">
                
                <h3 className="text-xl font-medium">Новая заметка</h3>
                
                {/* выделенный текст книги */}
                <div className="bg-beige-2 p-4 rounded-xl border border-accent-1/30">
                    <p className="text-sm text-gray-600 mb-1">Выделенный текст:</p>
                    <p className="text-blue italic bg-white p-2 rounded">"{selectedText}"</p>
                </div>
                
                {/* комментарий */}
                <textarea
                    placeholder="Ваш комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="border border-accent-1/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-1 w-full"
                    autoFocus
                />

                {/* выбор цвета*/}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Цвет подчеркивания:</span>
                    <div className="flex gap-3">
                        {/* Аналогично ReaderModal - 4 цвета */}
                        <button 
                            className={`w-10 h-10 rounded-full bg-yellow-300 border-2 transition-all ${color === 'yellow' ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' : 'border-transparent hover:scale-105'}`}
                            onClick={() => setColor('yellow')}
                        />
                        <button 
                            className={`w-10 h-10 rounded-full bg-green-300 border-2 transition-all ${color === 'green' ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' : 'border-transparent hover:scale-105'}`}
                            onClick={() => setColor('green')}
                        />
                        <button 
                            className={`w-10 h-10 rounded-full bg-blue-300 border-2 transition-all ${color === 'blue' ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' : 'border-transparent hover:scale-105'}`}
                            onClick={() => setColor('blue')}
                        />
                        <button 
                            className={`w-10 h-10 rounded-full bg-pink-300 border-2 transition-all ${color === 'pink' ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' : 'border-transparent hover:scale-105'}`}
                            onClick={() => setColor('pink')}
                        />
                    </div>
                </div>

                {/* указание видимости заметки */}
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Видимость:</span>
                    <div className="flex gap-4">
                        {/* Приватная заметка (только для автора) */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="visibility" 
                                value="private"
                                checked={visibility === 'private'}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="cursor-pointer"
                            />
                            <span className="text-sm">Приватная</span>
                        </label>
                        
                        {/* Публичная заметка (видят все) */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="visibility" 
                                value="public"
                                checked={visibility === 'public'}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="cursor-pointer"
                            />
                            <span className="text-sm">Публичная</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                    <button 
                        onClick={addNote} 
                        className="bg-accent-1 text-beige-1 rounded-xl px-6 py-2 hover:opacity-90 transition font-medium"
                    >
                        Сохранить заметку
                    </button>
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