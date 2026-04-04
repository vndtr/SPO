import React from 'react'
import FileInput from './FileInput'
export default function LibraryModal({state, setState}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-100">
        <div className="bg-beige-2 p-6 rounded max-w-lg w-full text-blue flex flex-col gap-2">
            <input type="text" placeholder='Введите название'/>
            <input type="text" placeholder='Введите автора'/>
            <FileInput/>
            <div className='flex gap-4'>
                <button onClick={()=> setState(!state)}>Добавить</button>
                <button onClick={()=> setState(!state)}>Закрыть</button>
            </div>
            </div>
    </div>
  )
}
