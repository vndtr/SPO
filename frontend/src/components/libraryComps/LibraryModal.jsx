import React from 'react';
import FileInput from './FileInput';
import '../../styles/components/modal.css';
import '../../styles/components/library.css';

export default function LibraryModal({ state, setState }) {
  return (
    <div className="modal-overlay" onClick={() => setState(!state)}>
      <div className="modal-backdrop"></div>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Добавление книги</h3>
          <button onClick={() => setState(!state)} className="modal-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Название книги</label>
            <input type="text" placeholder="Введите название" className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Автор</label>
            <input type="text" placeholder="Введите автора" className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Файл книги</label>
            <FileInput />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => setState(!state)} className="form-button-submit">
              Добавить
            </button>
            <button type="button" onClick={() => setState(!state)} className="form-button-cancel">
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
