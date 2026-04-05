import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../styles/components/sidebar.css';

export default function NavAside() {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <NavLink to="/" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
              Главная
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/library" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
              Моя библиотека
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/sessions" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
              Сессии
            </NavLink>
          </li>
          <li className="sidebar-item">
            <NavLink to="/profile" className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
              Профиль
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}