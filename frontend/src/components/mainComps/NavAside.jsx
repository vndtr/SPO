import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/sidebar.css';

export default function NavAside() {
  // Закрытие меню при клике на ссылку (для мобильных)
  const handleLinkClick = () => {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  };

  // Закрытие меню при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const toggleBtn = document.querySelector('.mobile-menu-toggle');
      
      if (sidebar && sidebar.classList.contains('open') && toggleBtn && !toggleBtn.contains(event.target) && !sidebar.contains(event.target)) {
        sidebar.classList.remove('open');
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <aside className="sidebar">
      {/* Кнопка закрытия для мобильных устройств */}
      <button 
        className="mobile-sidebar-close"
        onClick={() => {
          const sidebar = document.querySelector('.sidebar');
          if (sidebar) {
            sidebar.classList.remove('open');
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
              Главная
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/library" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
              Моя библиотека
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/sessions" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
              Сессии
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"} onClick={handleLinkClick}>
              Профиль
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}