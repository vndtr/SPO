import React from 'react';
import { Link } from 'react-router-dom';
import Progressbar from '../UI/Progressbar';
import '../../styles/components/cards.css';

export default function ContinueCard({ src, name, author, progress, chapter, chapter_max, page }) {
  return (
    <div className="continue-card">
      <img src={src} alt="" className="continue-card-image" />
      <div className="continue-card-content">
        <h2 className="continue-card-title">{name}</h2>
        <h3 className="continue-card-author">{author}</h3>
        <Progressbar progress={progress} />
        <div className="continue-card-meta">
          Глава {chapter} из {chapter_max}, страница {page}
        </div>
        <Link to="/reader">
          <button className="continue-card-btn">Продолжить чтение</button>
        </Link>
      </div>
    </div>
  );
}