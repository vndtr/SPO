import React from 'react'
import Progressbar from '../UI/Progressbar'
import { Link } from 'react-router-dom'
export default function ContinueCard({src, name, author, progress, chapter, chapter_max, page}) {
  return (
    <div className='flex rounded-2xl bg-beige-2 p-4'>
        <img src={src} alt="" className='max-w-[10vw] rounded-2xl m-2'/>
        <div className='w-full m-2 mt-auto'>
            <h2 className='text-2xl text-blue'>{name}</h2>
            <h3 className='text-sm'>{author}</h3>            
            <Progressbar progress={progress}/>
            <div className='my-4'>
                Глава {chapter} из {chapter_max}, страница {page}
            </div>
            <Link to="/reader">
              <button className='bg-accent-1
              text-beige-1
              rounded-2xl 
              px-8 py-2
              hover:cursor-pointer'
              >Продолжить чтение</button>
            </Link>
        </div>
    </div>
  )
}
