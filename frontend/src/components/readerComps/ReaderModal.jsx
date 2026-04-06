import { useState, useEffect } from "react";
import '../../styles/components/modal.css';
import '../../styles/components/reader.css';

export default function ReaderModal({ 
    onClose,
    selectedText,
    initialComment = '',
    initialColor = 'yellow',
    onAddNote,
    isEdit = false
}) { 
    const [comment, setComment] = useState(initialComment);
    const [color, setColor] = useState(initialColor);
    
    const handleClose = () => {
    if (window.preserveHighlights) {
        window.preserveHighlights();
    }
    onClose();

    setTimeout(() => {
        if (window.restoreHighlights) {
            window.restoreHighlights();
        }
        if (window.refreshAllHighlights) {
            window.refreshAllHighlights();
        }
        if (window.forceApplyStyles) {
            window.forceApplyStyles();
        }
    }, 50);
    };

    useEffect(() => {
        setComment(initialComment);
        setColor(initialColor);
    }, [initialComment, initialColor]);

    const handleSave = () => {
        if (!comment.trim() && !isEdit) return;
        onAddNote(color, comment);
        handleClose(); 
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-backdrop"></div>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">{isEdit ? 'Редактирование заметки' : 'Новая заметка'}</h3>
                    <button onClick={handleClose} className="modal-close">
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
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid rgba(212, 163, 115, 0.3)',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem',
                        backgroundColor: '#ffffff',
                        color: '#1e293b',
                        resize: 'vertical'
                    }}
                    autoFocus
                    />

                <div className="reader-modal-color-section">
                    <span className="reader-modal-color-label" style={{ color: '#1e293b', fontWeight: '500' }}>Цвет подчеркивания:</span>
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

                <div className="form-actions">
                    <button onClick={handleSave} className="form-button-submit">
                        {isEdit ? 'Сохранить изменения' : 'Сохранить заметку'}
                    </button>
                    <button onClick={handleClose} className="form-button-cancel">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}