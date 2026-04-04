import React from 'react'
import Progressbar from '../UI/Progressbar'
import { Link } from 'react-router-dom';
export default function LibraryBook({ 
  id,  
  src, 
  title, 
  author, 
  progress,
  coverColor,
  onDelete 
}) {
   const handleDelete = (e) => {
  e.stopPropagation();
  if (window.confirm('Вы уверены, что хотите удалить эту книгу из библиотеки? Все заметки и цитаты будут также удалены.')) {
    console.log('Delete book:', id);  
    onDelete(id);  
  }
};
  return (
    <div className="relative rounded-2xl overflow-hidden m-4 p-4 min-h-[320px] flex">
      {/* Фон с градиентом или цветом */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
      
      {/* Затемнение для читабельности текста */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Контент поверх фона */}
      <div className="relative z-10 w-full text-beige-1 flex flex-col justify-end">
        <h2 className="text-2xl">{title || 'Без названия'}</h2>
        <h3 className="text-sm opacity-80">{author || 'Неизвестный автор'}</h3>
        
        <Progressbar progress={progress || 0} />

        <div className="flex my-2 gap-4">
<Link to={`/reader?bookId=${id}&title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`}>
  <button className="text-accent-1 bg-beige-1 rounded-2xl px-4 py-1 hover:cursor-pointer">
    Открыть
  </button>
</Link>
          <Link to={`/session-create?bookId=${id}`}>
            <button className="bg-accent-1 text-beige-1 rounded-2xl px-4 py-1 hover:cursor-pointer">
              Сессия
            </button>
          </Link>
        </div>

        {/* Кнопка удаления */}
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 text-beige-1 hover:text-red-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5zM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1H11zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47zM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

