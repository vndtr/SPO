import React from 'react';
import { Link } from 'react-router-dom';
import Progressbar from '../UI/Progressbar';
import '../../styles/components/cards.css';

export default function Card({ src, name, progress, author, members, notes, url }) {
  return (
    <div className="card">
      <img src={src} alt="" className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{name}</h2>
        <h3 className="card-subtitle">{author}</h3>
        <Progressbar progress={progress} />
        <div className="card-stats">
          {members} участников, {notes} заметок
        </div>
        <div className="card-invite">
          Ссылка для приглашения: {url}
        </div>
        <div className="card-action">
          <Link to="/session-reader">
            <button className="card-button">Перейти</button>
          </Link>
        </div>
      </div>
    </div>
  );
}