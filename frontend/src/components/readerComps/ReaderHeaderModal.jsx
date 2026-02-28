import React from 'react';
import { Link } from 'react-router-dom';

export default function ReaderHeaderModal({ onClose, onParticipantsClick }) {
    const handleParticipantsClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Клик по Участники');
        onParticipantsClick(); // вызываем функцию из родителя
    };

    return (
        <div className="fixed right-2 top-24 z-50" onClick={(e) => e.stopPropagation()}>
            <div className="bg-beige-2 p-6 rounded-2xl border border-accent-1 max-w-lg w-64 text-blue flex flex-col gap-2 shadow-xl">
                <ul className='flex flex-col items-start gap-2'>
                    <li 
                        className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg"
                        onClick={handleParticipantsClick}
                    >
                        Участники
                    </li>
                    <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                        Настройки
                    </li>
                    <Link to="/" onClick={onClose} className="w-full">
                        <li className="cursor-pointer hover:text-accent-1 transition-colors w-full px-2 py-2 hover:bg-beige-1 rounded text-lg">
                            Выйти из сессии
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
    );
}