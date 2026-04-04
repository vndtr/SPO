import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Progressbar from '../UI/Progressbar';

export default function SessionItem({ id, name, book_id, book_title, book_author, progress, members, notes, link }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='flex rounded-2xl bg-beige-2 p-4 my-6'>
      <div className='w-full'>
        <h2 className='text-2xl text-blue'>{name}</h2>
        <h3 className='text-sm'>{book_author}</h3>    
        <Progressbar progress={progress || 0}/>           
        <div>
          {members || 1} участников, {notes || 0} заметок
        </div>
        <div className='flex items-center gap-2 mt-2'>
          <span className='text-sm text-gray-500 truncate max-w-[200px]'>{link}</span>
          <button 
            onClick={copyLink}
            className='text-xs bg-accent-1/20 text-accent-1 px-2 py-1 rounded hover:bg-accent-1/40'
          >
            {copied ? 'Скопировано!' : 'Копировать'}
          </button>
        </div>
        <div className='flex my-4 justify-end'>
<Link to={`/session-reader?sessionId=${id}&name=${encodeURIComponent(name)}`}>
  <button>Перейти</button>
</Link>
        </div>
      </div>
    </div>
  );
}