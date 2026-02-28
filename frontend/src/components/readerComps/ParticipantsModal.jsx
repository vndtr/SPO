import React from 'react';

export default function ParticipantsModal({ onClose }) {

    // Данные для демонстрации
    const participants = [
        {
            id: 'teacher-1',
            name: 'Лев Петров',
            role: 'teacher',  // учитель (админ)
        },
        {
            id: 'student-1',
            name: 'Гольскун',
            role: 'student',  // ученик
        },
        {
            id: 'student-2',
            name: 'Галактион',
            role: 'student',  // ученик
        }
    ];
    
    // Останавливает всплытие события при клике на само модальное окно, чтобы клик по окну не закрывал его (закрытие только по фону или кнопке)
    
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    console.log('ParticipantsModal рендерится'); // для отладки

    
    return (
        // Основной контейнер модального окна (на весь экран)
        <div 
            className="fixed inset-0 flex items-center justify-center z-[10000]"
            onClick={onClose} // клик по фону закрывает окно
        >
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* модалка */}
            <div 
                className="bg-beige-1 p-6 rounded-2xl max-w-md w-full text-blue flex flex-col gap-4 border border-accent-1 shadow-2xl relative z-[10001]"
                onClick={handleModalClick} // предотвращаем закрытие при клике на окно
            >
                {/* заголовок и кнопка закрытия(крестик)*/}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium">Участники сессии</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                {/* участники*/}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                    {participants.map(participant => (
                        <div 
                            key={participant.id}
                            className="flex items-center gap-3 p-3 bg-beige-2 rounded-xl hover:bg-beige-2/80 transition-colors"
                        >
                            {/* Аватар (заглушка) */}
                            <div className="w-10 h-10 rounded-full bg-accent-1/20 flex items-center justify-center text-xl">
                                {participant.avatar}
                            </div>
                            
                            {/* статус участника */}
                            <div className="flex-1">
                                <p className="font-medium">{participant.name}</p>
                                <p className="text-xs text-gray-500">
                                    {participant.role === 'teacher' ? 'Учитель' : 'Ученик'}
                                </p>
                            </div>
                            
                            {/* Отметка для админа */}
                            {participant.role === 'teacher' && (
                                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                                    Админ
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {/* закрыть */}
                <div className="flex justify-end mt-4">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 transition"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}