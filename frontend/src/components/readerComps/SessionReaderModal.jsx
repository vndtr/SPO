import { useState, useEffect } from "react"

export default function SessionReaderModal({ 
    onClose, 
    selectedText, 
    onAddNote,
    isEdit = false,
    initialComment = '',
    initialColor = 'yellow',
    initialVisibility = 'private'
}) { 
    const [comment, setComment] = useState(initialComment);
    const [color, setColor] = useState(initialColor);
    const [visibility, setVisibility] = useState(initialVisibility);

    useEffect(() => {
        setComment(initialComment);
        setColor(initialColor);
        setVisibility(initialVisibility);
    }, [initialComment, initialColor, initialVisibility]);

    const handleSave = () => {
        if (!comment.trim()) return;
        onAddNote(color, comment, visibility);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={onClose}>
            <div className="bg-beige-1 p-6 rounded-2xl max-w-lg w-full text-blue flex flex-col gap-4 border border-accent-1" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl font-medium">{isEdit ? 'Редактирование заметки' : 'Новая заметка'}</h3>
                
                <div className="bg-beige-2 p-4 rounded-xl border border-accent-1/30">
                    <p className="text-sm text-gray-600 mb-1">Выделенный текст:</p>
                    <p className="text-blue italic bg-white p-2 rounded">"{selectedText}"</p>
                </div>
                
                <textarea
                    placeholder="Ваш комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="border border-accent-1/30 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-accent-1 w-full"
                    autoFocus
                />

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Цвет подчеркивания:</span>
                    <div className="flex gap-3">
                        {['yellow', 'green', 'blue', 'pink'].map(c => (
                            <button 
                                key={c}
                                className={`w-10 h-10 rounded-full bg-${c}-300 border-2 transition-all ${
                                    color === c 
                                        ? 'border-accent-1 scale-110 ring-2 ring-accent-1/50' 
                                        : 'border-transparent hover:scale-105'
                                }`}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Видимость:</span>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={(e) => setVisibility(e.target.value)} />
                            <span className="text-sm">Приватная (только для вас)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={(e) => setVisibility(e.target.value)} />
                            <span className="text-sm">Публичная</span>
                        </label>
                    </div>
                </div>

                <div className="flex gap-4 justify-end mt-4">
                    <button onClick={handleSave} className="bg-accent-1 text-beige-1 rounded-xl px-6 py-2 hover:opacity-90 transition font-medium">
                        {isEdit ? 'Сохранить изменения' : 'Сохранить заметку'}
                    </button>
                    <button onClick={onClose} className="border border-accent-1 text-accent-1 rounded-xl px-6 py-2 hover:bg-accent-1/10 transition font-medium">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}