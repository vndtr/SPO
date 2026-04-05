import React, { useEffect, useRef } from 'react';
import '../../styles/components/reader.css';

export default function SelectionMenu({ position, onClose, onQuote, onNoteClick, selectedText }) {
  const menuRef = useRef(null);

  const handleClose = () => {
    // Восстанавливаем стили перед закрытием
    if (window.forceApplyStyles) {
      setTimeout(() => {
        window.forceApplyStyles();
      }, 10);
    }
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!position) return null;

  const menuStyle = {
    position: 'fixed',
    top: position.top - 60,
    left: position.left + (position.width / 2) - 150,
    zIndex: 9999
  };

  return (
    <div ref={menuRef} style={menuStyle} className="selection-menu">
      <div className="selection-menu-content">
        <div className="selection-menu-color-section">
          <span className="selection-menu-color-label">Цитата:</span>
          <div className="selection-menu-colors">
            <button 
              onClick={() => { onQuote('yellow', selectedText); handleClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-yellow"
            />
            <button 
              onClick={() => { onQuote('green', selectedText); handleClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-green"
            />
            <button 
              onClick={() => { onQuote('blue', selectedText); handleClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-blue"
            />
            <button 
              onClick={() => { onQuote('pink', selectedText); handleClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-pink"
            />
          </div>
        </div>

        <div className="selection-menu-divider"></div>

        <button
          onClick={() => { onNoteClick(); handleClose(); }}
          className="selection-menu-note-btn"
        >
          Создать заметку
        </button>
      </div>
    </div>
  );
}