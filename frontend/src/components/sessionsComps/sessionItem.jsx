import React from 'react'
import { Link } from 'react-router-dom'
import Progressbar from '../UI/Progressbar'
export default function SessionItem({src, name, progress, author, members, notes, url}) {
  return (
    <div className='flex rounded-2xl bg-beige-2 p-4 my-6'>
        <img src={src} alt="" className='max-w-[10vw] m-2 rounded-2xl'/>
        <div className='w-full m-2'>
            <h2 className='text-2xl text-blue'>{name}</h2>
            <h3 className='text-sm'>{author}</h3>    
            <Progressbar progress={progress}/>           
            <div>
                {members} участников, {notes} заметок
            </div>
            <div>
                Ссылка для приглашения:
                {url}
            </div>
            <div className='flex my-8 justify-end'>
              <Link to="/session-reader">
    <button className='bg-accent-1 text-beige-1 rounded-2xl px-4 py-1 hover:cursor-pointer'>
        Перейти
    </button>
</Link>
            </div>
        </div>
    </div>
  )
}
