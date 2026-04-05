// src/utils/bookCover.js

// Градиенты в стиле дизайна (глубокие синие, индиго, лавандовые, изумрудные)
const gradients = [
  // Синяя гамма (как боковая панель)
  { start: '#1e2a3a', end: '#0f1722' },      // Тёмно-синий (как сайдбар)
  { start: '#1e3a5f', end: '#0f2842' },      // Глубокий синий
  { start: '#2c3e50', end: '#1a2a3a' },      // Сланцево-синий
  { start: '#1a2c3e', end: '#0f1e2c' },      // Темно-синий градиент
  
  // Индиго и лавандовые
  { start: '#2d3a6e', end: '#1a2552' },      // Индиго
  { start: '#3a4a8c', end: '#1e2d5e' },      // Королевский синий
  { start: '#4c5b8c', end: '#2a3a6e' },      // Сине-лавандовый
  { start: '#5b6cae', end: '#3a4a8c' },      // Светлый индиго
  
  // Бирюзово-синие
  { start: '#1a6b6b', end: '#0f4a4a' },      // Тёмная бирюза
  { start: '#2a7a7a', end: '#1a5a5a' },      // Морская волна
  { start: '#1e6b6b', end: '#0f4a5a' },      // Сине-зелёный
  
  // Фиолетово-синие
  { start: '#2d3a6e', end: '#1a2552' },      // Тёмный индиго
  { start: '#4a3a7a', end: '#2a1a5a' },      // Фиолетово-синий
  { start: '#5a4a8c', end: '#3a2a6e' },      // Лавандовый
  { start: '#6b5b9e', end: '#4a3a7a' },      // Светлый фиолетовый
  
  // Изумрудные и тёмно-зелёные
  { start: '#1a4a3a', end: '#0f2a20' },      // Тёмный изумруд
  { start: '#2a5a4a', end: '#1a3a2a' },      // Лесной
  { start: '#1a5a4a', end: '#0f3a2a' },      // Шалфейный
  
  // Акцентные (оранжевые вкрапления как у вас)
  { start: '#1e2a3a', end: '#c97e3a' },      // Синий + терракотовый акцент
  { start: '#2d3a6e', end: '#d4a373' },      // Индиго + песочный
  { start: '#1a2c3e', end: '#ffb347' }       // Тёмно-синий + оранжевый акцент
];

/**
 * Генерирует градиент для обложки на основе названия книги
 * @param {string} title - Название книги
 * @returns {string} - CSS градиент
 */
export const generateBookGradient = (title) => {
  if (!title || title.length === 0) {
    const randomIndex = Math.floor(Math.random() * gradients.length);
    const gradient = gradients[randomIndex];
    return `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`;
  }
  
  let sum = 0;
  for (let i = 0; i < title.length; i++) {
    sum += title.charCodeAt(i);
  }
  const index = sum % gradients.length;
  const gradient = gradients[index];
  
  return `linear-gradient(135deg, ${gradient.start} 0%, ${gradient.end} 100%)`;
};

/**
 * Получает стиль обложки для книги
 * @param {string} title - Название книги
 * @param {string} coverImage - URL обложки (если есть)
 * @returns {object} - Объект со стилями
 */
export const getBookCoverStyle = (title, coverImage) => {
  return {
    backgroundImage: generateBookGradient(title),
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
};