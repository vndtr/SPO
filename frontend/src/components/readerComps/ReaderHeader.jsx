import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReaderHeaderModal from './ReaderHeaderModal.jsx';
import ParticipantsModal from './ParticipantsModal.jsx';

export default function ReaderHeader({ isSession = false }) {
    
    // Управление видимостью основного меню (открывается по клику на троеточие)
    const [modalOpen, setModalOpen] = useState(false);
    
    // Управление видимостью модального окна участников (только для сессии)
    const [showParticipants, setShowParticipants] = useState(false);

    // Закрывает основное меню и открывает окно участников
    const handleParticipantsClick = () => {
        console.log('Открытие окна участников');
        setModalOpen(false);      // закрываем основное меню
        setShowParticipants(true); // открываем окно участников
    };

    // Закрытие окна участников
    const handleCloseParticipants = () => {
        console.log('Закрытие окна участников');
        setShowParticipants(false);
    };
    
    return (
        // Основной контейнер шапки 
        <div className='flex text-accent-2 relative' style={{ zIndex: 30 }}>
            
            {/* левая часть -  логотип*/}
            <div className='min-w-[15vw] flex justify-center bg-gray items-center hover:active'>
                <Link to='/'>
                    <svg
                        className="w-32 h-32 text-beige-1"
                        viewBox="0 0 881.3 192.21"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                    >
                        <g>
                            <path className="cls-1" d="M.45,113.21c3.55,2.61,50.38,3.65,71.89-6.55,21.75-10.32,32.74-22.84,52.74-27.27,33.59-7.43,65.4,13.4,62,12.53-7.53-1.94-27.07-9.66-58.34.83-14.31,4.8-18.48,7.51-35.06,17.37-21.2,12.6-31.33,15.23-51.12,16.05-23.08.96-46.08-15.88-42.1-12.95Z"/>
                            <path className="cls-1" d="M94.12,126.97c3.55,2.61,50.38,3.65,71.89-6.55,21.75-10.32,32.74-22.84,52.74-27.27,33.59-7.43,65.4,13.4,62,12.53-7.53-1.94-27.07-9.66-58.34.83-14.31,4.8-18.48,7.51-35.06,17.37-21.2,12.6-31.33,15.23-51.12,16.05-23.08.96-46.08-15.88-42.1-12.95Z"/>
                        </g>
                        <g>
                            <path className="cls-1" d="M276.27,168.58c10.5,7.19,25.08,12.3,40.7,12.3,27.84,0,44.91-15.82,44.91-38.76,0-20.86-10.85-33.16-37.73-43.53-29.98-10.64-47.95-26.05-47.95-51.41,0-27.29,22.52-47.19,54.17-47.19,17.48,0,30.75,4.49,37.1,8.77l-5.11,11.06c-5.04-3.52-16.93-8.84-32.89-8.84-30.05,0-40.28,19.28-40.28,33.92,0,20.66,11.95,31.23,38.62,41.66,30.75,12.44,47.05,26.39,47.05,54.31s-19.35,51.2-59.08,51.2c-16.1,0-34.82-5.25-44.49-12.51l4.97-10.98Z"/>
                            <path className="cls-1" d="M413.57,121.6c0,42.35,23.08,59.14,50.44,59.14,19.34,0,29.37-3.87,36.89-7.53l3.39,10.36c-5.11,2.76-18.72,8.5-41.87,8.5-38.14,0-61.84-27.78-61.84-66.6,0-44.29,25.36-72,59.63-72,43.46,0,51.68,40.83,51.68,59.97,0,3.73,0,5.8-.42,8.15h-97.91ZM498.14,111.1c.34-18.52-7.39-46.71-39.66-46.71-29.16,0-41.8,26.25-44.22,46.71h83.88Z"/>
                            <path className="cls-1" d="M545.62,88.23c0-12.16-.42-21.28-1.11-31.71h12.23l.97,23.97h.55c7.26-14.92,23.91-27.02,45.67-27.02,12.65,0,46.29,6.49,46.29,56.17v79.53h-13.13v-78.35c0-24.18-9.33-46.09-36.76-46.09-18.66,0-34.55,13.34-39.8,30.54-.97,3.18-1.8,7.67-1.8,11.82v82.08h-13.13v-100.95Z"/>
                            <path className="cls-1" d="M688.31,171.76c7.12,4.49,17.83,9.19,29.85,9.19,20.87,0,30.82-11.47,30.82-25.29,0-14.58-8.77-22.39-27.92-29.92-21.69-8.43-33.65-20.24-33.65-36.34,0-19.14,15.06-35.93,40.84-35.93,12.23,0,22.52,3.66,29.43,8.43l-5.25,10.71c-4.56-3.25-13.13-8.02-26.26-8.02-16.86,0-25.84,10.85-25.84,22.94,0,13.89,9.39,19.76,27.5,27.22,21.42,8.5,34.13,19.14,34.13,39.24,0,22.73-17.61,38.07-44.77,38.07-12.78,0-24.87-3.66-33.71-9.19l4.84-11.12Z"/>
                            <path className="cls-1" d="M869.21,189.17l-1.93-19h-.62c-6.43,10.22-21.21,22.04-42.28,22.04-26.67,0-39.03-18.79-39.03-36.48,0-30.61,26.94-49.06,80.9-48.5v-3.52c0-13.13-2.56-39.31-33.92-39.11-11.61,0-23.7,3.11-33.31,9.88l-4.15-9.54c12.09-8.22,26.88-11.47,38.9-11.47,38.28,0,45.6,28.74,45.6,52.44v51.75c0,10.5.41,21.35,1.93,31.51h-12.09ZM866.24,118.28c-28.88-.83-67.02,3.52-67.02,35.38,0,19.07,12.57,27.64,26.39,27.64,22.11,0,34.69-13.68,39.24-26.6.97-2.83,1.38-5.67,1.38-7.95v-28.47Z"/>
                        </g>
                    </svg>
                </Link>
            </div>

            {/* Название текста*/}
            <div className='bg-beige-2 w-screen flex justify-between border-b border-accent-1'>          
                <div className='w-full max-w-lg my-6 flex items-center ml-10 text-3xl '>
                    <h2>Тоска</h2>         
                </div>

                {/* Иконки в правой части */}
                <div className='flex p-4 m-10 mr-0 gap-4 text-gray border-l border-t border-b rounded-2xl rounded-tr-none rounded-br-none border-accent-1'>
                    
                    {/* Иконка уведомлений */}
                    <button className='hover:cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-bell" viewBox="0 0 16 16">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5 5 0 0 1 13 6c0 .88.32 4.2 1.22 6"/>
                        </svg>
                    </button>
                    
                    {/* Иконка профиля (ссылка на страницу профиля) */}
                    <Link to="/profile">
                        <button className='hover:cursor-pointer'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
                                <circle cx="8" cy="8" r="8"/>
                            </svg>
                        </button>
                    </Link>
                    
                    {/* Иконка меню (троеточие) - открывает/закрывает основное меню */}
                    <button className='hover:cursor-pointer text-accent-1' onClick={() => setModalOpen(!modalOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                        </svg>
                    </button>
                </div>
            </div>
            
            {/* Меню по клику на троеточие */}
            {modalOpen && (
                <div className="fixed right-2 top-24 z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-beige-2 p-6 rounded-2xl border border-accent-1 max-w-lg w-64 text-blue flex flex-col gap-2 shadow-xl">
                        <ul className='flex flex-col items-start gap-2'>
                            {isSession ? (
                                // Меню для читалки сессии (isSession == true)
                                <>
                                    <li 
                                        className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg"
                                        onClick={handleParticipantsClick}
                                    >
                                        Участники
                                    </li>
                                    <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                                        Настройки
                                    </li>
                                    <Link to="/" onClick={() => setModalOpen(false)} className="w-full">
                                        <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                                            Выйти из сессии
                                        </li>
                                    </Link>
                                </>
                            ) : (
                                // Меню для личного чтения
                                <>
                                    <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                                        Настройки
                                    </li>
                                    <Link to="/" onClick={() => setModalOpen(false)} className="w-full">
                                        <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                                            Выйти
                                        </li>
                                    </Link>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            )}
            
            {/* модалка с участниками для читалки сессии */}
            {isSession && showParticipants && (
                <ParticipantsModal onClose={handleCloseParticipants} />
            )}
        </div>
    );
}