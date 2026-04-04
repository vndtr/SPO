import React from 'react'
import ContinueCard from '../components/mainComps/ContinueCard.jsx'
import Card from '../components/mainComps/Card.jsx'
import Note from '../components/mainComps/Note.jsx'
import itemsContinue from "../components/continueItems.json"
import itemsDiscuss from "../components/discussItems.json"
import notesList from "../components/notes.json"
import Header from '../components/mainComps/Header.jsx'
import NavAside from '../components/mainComps/NavAside.jsx'
import { Link } from 'react-router-dom'
export default function MainView() {
    const discuss = Object.entries(itemsDiscuss)
    const notes = Object.entries(notesList)
    const items = Object.entries(itemsContinue)
  return (
    <>
    <Header/>
    <div className='flex'>
      <NavAside/>
      <div className='bg-beige-1 flex
    text-accent-2
    w-screen
    p-10'>
        <div className='flex-3 text-blue'>
            <h1 className='text-2xl mb-5'>Продолжить</h1>
            {items.map(([key, values]) => (
                <ContinueCard key={key} {...values}/>
            ))}
            <div className='flex-col justify-between my-6'>
                <div className='flex justify-between'><h1 className='text-2xl'>Ваши сессии</h1>
                <Link to='/sessions'><h3 className='text-accent-1 text-lg mr-8'>Смотреть все</h3></Link></div>
                <div className='grid grid-cols-2 gap-10'>
                {discuss.map(([key, values])=>(<Card key={key} {...values}/>))}
                </div>
            </div>
        </div>
        <div className='flex flex-col flex-1 text-blue '>
            <div className='flex flex-col m-4 p-4  border border-main-3 rounded-lg bg-main-3 h-fit'>
                <div>
                    <div className='flex justify-between'>
                        <h2>Новые заметки</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots text-accent-1" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
                        </svg>
                    </div>
                    <div>
                        <ul className='ml-5'>
                            {notes.map(([key, values])=>(<Note key={key} {...values}/>))}
                        </ul>
                    </div>
                
                    {/* <div className='flex justify-end'>
                        <Link to='/'>Перейти</Link>
                        </div> */}
                </div>
            </div>
                
        </div>
        
    </div>
    </div>
    
    </>
  )
}
