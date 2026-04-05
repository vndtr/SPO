import React, { useEffect, useRef } from 'react';
import '../../styles/components/reader.css';

export default function SelectionMenu({ position, onClose, onQuote, onNoteClick, selectedText }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
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
              onClick={() => { onQuote('yellow', selectedText); onClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-yellow"
            />
            <button 
              onClick={() => { onQuote('green', selectedText); onClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-green"
            />
            <button 
              onClick={() => { onQuote('blue', selectedText); onClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-blue"
            />
            <button 
              onClick={() => { onQuote('pink', selectedText); onClose(); }}
              className="selection-menu-color-btn selection-menu-color-btn-pink"
            />
          </div>
        </div>

        <div className="selection-menu-divider"></div>

        <button
          onClick={() => { onNoteClick(); }}
          className="selection-menu-note-btn"
        >
          Создать заметку
        </button>
      </div>
    </div>
  );
}