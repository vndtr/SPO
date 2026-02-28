import React from 'react'
import Progressbar from '../UI/Progressbar'
import { Link } from 'react-router-dom';
export default function LibraryBook({ src, name, author, progress }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden m-4 p-4 min-h-[320px] flex"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-transparent" />
      {/* затемнение для читабельности текста */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* контент поверх фона */}
      <div className="relative z-10 w-full text-beige-1 flex flex-col justify-end">
        <h2 className="text-2xl">{name}</h2>
        <h3 className="text-sm opacity-80">{author}</h3>
        <Progressbar progress={progress} />

        <div className="flex my-2 gap-4">
          <Link to="/reader">
          <button className="text-accent-1 bg-beige-1 rounded-2xl px-4 py-1 hover:cursor-pointer">
            Открыть
          </button>
          </Link>
         
          <button className="bg-accent-1 text-beige-1 rounded-2xl px-4 py-1 hover:cursor-pointer">
            Сессия
          </button>
          
        </div>
      </div>
    </div>
  );
}
