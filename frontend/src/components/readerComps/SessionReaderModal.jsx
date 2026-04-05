import { useState, useEffect } from "react";
import '../../styles/components/modal.css';
import '../../styles/components/reader.css';

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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-backdrop"></div>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isEdit ? 'Редактирование заметки' : 'Новая заметка'}</h3>
                    <button onClick={onClose} className="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div className="reader-modal-selected-text">
                    <p className="reader-modal-selected-label">Выделенный текст:</p>
                    <p className="reader-modal-selected-content">"{selectedText}"</p>
                </div>
                
                <textarea
                    placeholder="Ваш комментарий..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="reader-modal-textarea"
                    autoFocus
                />

                <div className="reader-modal-color-section">
                    <span className="reader-modal-color-label">Цвет подчеркивания:</span>
                    <div className="reader-modal-colors">
                        {['yellow', 'green', 'blue', 'pink'].map(c => (
                            <button 
                                key={c}
                                className={`reader-modal-color-btn reader-modal-color-btn-${c} ${color === c ? 'reader-modal-color-btn-active' : ''}`}
                                onClick={() => setColor(c)}
                            />
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <span className="form-label">Видимость:</span>
                    <div className="reader-modal-visibility-options">
                        <label className="reader-modal-visibility-option">
                            <input type="radio" name="visibility" value="private" checked={visibility === 'private'} onChange={(e) => setVisibility(e.target.value)} />
                            <span className="text-sm">Приватная (только для вас)</span>
                        </label>
                        <label className="reader-modal-visibility-option">
                            <input type="radio" name="visibility" value="public" checked={visibility === 'public'} onChange={(e) => setVisibility(e.target.value)} />
                            <span className="text-sm">Публичная</span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button onClick={handleSave} className="form-button-submit">
                        {isEdit ? 'Сохранить изменения' : 'Сохранить заметку'}
                    </button>
                    <button onClick={onClose} className="form-button-cancel">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}