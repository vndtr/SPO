import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/components/reader.css';

export default function ReaderHeaderModal({ onClose, onParticipantsClick }) {
  const handleParticipantsClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Клик по Участники');
    onParticipantsClick();
  };

  return (
    <div className="reader-header-menu" onClick={(e) => e.stopPropagation()}>
      <div className="reader-header-menu-content">
        <ul className="reader-header-menu-list">
          <li 
            className="reader-header-menu-item"
            onClick={handleParticipantsClick}
          >
            Участники
          </li>
          <li className="reader-header-menu-item">
            Настройки
          </li>
          <Link to="/" onClick={onClose} className="w-full">
            <li className="reader-header-menu-item">
              Выйти из сессии
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}