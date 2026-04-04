import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
export default function NavAside() {
    const [currentPage, setCurrentPage] = useState('main')
  return (
    <div className='
    max-w-[30vw] min-w-[15vw]
    min-h-screen
    
    flex flex-col bg-gray text-beige-1'>
        <ul className='flex flex-col gap-4 p-6'>
            <li>
                <NavLink to='/' className={({ isActive }) => isActive ? 'border-l-4 rounded-tl-xs  rounded-tr-xs rounded-br-xs bg-beige-1 text-gray text-xl font-medium ring-8 ring-beige-1 rounded-bl-xs border-gray pl-3 block w-full ' : ' text-xl block w-full pl-3'}>Главная</NavLink>
            </li>
            <li>
                <NavLink to='/library' className={({ isActive }) => isActive ?  'border-l-4 rounded-tl-xs  rounded-tr-xs rounded-br-xs bg-beige-1 text-gray text-xl font-medium ring-8 ring-beige-1 rounded-bl-xs border-gray pl-3 block w-full ' : ' text-xl block w-full pl-3'}>Моя библиотека</NavLink>
            </li>
            <li>
                <NavLink to='/sessions' className={({ isActive }) => isActive ?  'border-l-4 rounded-tl-xs  rounded-tr-xs rounded-br-xs bg-beige-1 text-gray text-xl font-medium ring-8 ring-beige-1 rounded-bl-xs border-gray pl-3 block w-full ' : ' text-xl block w-full pl-3'}>Сессии</NavLink>
            </li>   
            <li>
                <NavLink to='/profile' className={({ isActive }) => isActive ?  'border-l-4 rounded-tl-xs  rounded-tr-xs rounded-br-xs bg-beige-1 text-gray text-xl font-medium ring-8 ring-beige-1 rounded-bl-xs border-gray pl-3 block w-full ' : ' text-xl block w-full pl-3'}>Профиль</NavLink>
            </li>
        </ul>
    </div>
  )
}
