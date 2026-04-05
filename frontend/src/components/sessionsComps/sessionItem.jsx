import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Progressbar from '../UI/Progressbar';
import '../../styles/components/sessions.css';

export default function SessionItem({ id, name, book_title, book_author, progress, members, notes, link }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="session-card">
      <div className="session-content">
        <h2 className="session-name">{name}</h2>
        <h3 className="session-author">{book_author}</h3>
        
        <div className="session-progress">
          <Progressbar progress={progress || 0} />
        </div>
        
        <div className="session-stats">
          {members || 1} участников, {notes || 0} заметок
        </div>
        
        <div className="session-invite">
          <span className="invite-link">{link}</span>
          <button 
            onClick={copyLink}
            className="copy-button"
          >
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
        
        <div className="session-action">
          <Link to={`/session-reader?sessionId=${id}&name=${encodeURIComponent(name)}`}>
            <button className="session-button">Перейти</button>
          </Link>
        </div>
      </div>
    </div>
  );
}