import React, { useState, useEffect } from 'react';
import { getSessionParticipants, updateParticipantRole } from '../../services/api';

export default function ParticipantsModal({ sessionId, currentUserId, onClose }) {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadParticipants();
    }, [sessionId]);

    const loadParticipants = async () => {
        try {
            setLoading(true);
            const data = await getSessionParticipants(sessionId);
            setParticipants(data);
        } catch (error) {
            console.error('Error loading participants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRoleId) => {
        setUpdating(true);
        try {
            await updateParticipantRole(sessionId, userId, newRoleId);
            await loadParticipants();
            
            // Отправляем событие обновления роли
            window.dispatchEvent(new CustomEvent('participantsUpdated'));
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Ошибка при изменении роли');
        } finally {
            setUpdating(false);
        }
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    // Находим создателя сессии
    const sessionCreator = participants.find(p => p.user_id === participants[0]?.user_id);
    const isCreator = (participant) => participant.user_id === sessionCreator?.user_id;
    const canChangeRole = (participant) => {
        if (participant.user_id === currentUserId) return false;
        if (isCreator(participant)) return false;
        return true;
    };

    // Простое закрытие без лишних вызовов
    const handleClose = () => {
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-[10000]"
            onClick={handleClose}
        >
            <div className="absolute inset-0 bg-black/50"></div>
            
            <div 
                className="bg-beige-1 p-6 rounded-2xl max-w-md w-full text-blue flex flex-col gap-4 border border-accent-1 shadow-2xl relative z-[10001]"
                onClick={handleModalClick}
            >
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium">Участники сессии</h3>
                    <button 
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                {loading ? (
                    <div className="text-center py-8">Загрузка...</div>
                ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {participants.map(participant => (
                            <div 
                                key={participant.id}
                                className="flex items-center gap-3 p-3 bg-beige-2 rounded-xl hover:bg-beige-2/80 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-accent-1/20 flex items-center justify-center text-xl">
                                    {participant.user?.name?.[0] || '?'}
                                </div>
                                
                                <div className="flex-1">
                                    <p className="font-medium">
                                        {participant.user?.name} {participant.user?.last_name}
                                        {participant.user_id === currentUserId && ' (Вы)'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {participant.role_id === 2 ? 'Учитель' : 'Ученик'}
                                    </p>
                                </div>
                                
                                {canChangeRole(participant) && (
                                    <select
                                        value={participant.role_id}
                                        onChange={(e) => handleRoleChange(participant.user_id, parseInt(e.target.value))}
                                        disabled={updating}
                                        className="text-xs bg-accent-1/20 text-accent-1 px-2 py-1 rounded hover:bg-accent-1/40 cursor-pointer"
                                    >
                                        <option value={1}>Ученик</option>
                                        <option value={2}>Учитель</option>
                                    </select>
                                )}
                                
                                {isCreator(participant) && (
                                    <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                                        Создатель
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-end mt-4">
                    <button 
                        onClick={handleClose}
                        className="px-4 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 transition"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}