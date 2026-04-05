import React, { useState, useEffect } from 'react';
import { getSessionParticipants, updateParticipantRole } from '../../services/api';
import '../../styles/components/modal.css';
import '../../styles/components/reader.css';

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

    const sessionCreator = participants.find(p => p.user_id === participants[0]?.user_id);
    const isCreator = (participant) => participant.user_id === sessionCreator?.user_id;
    const canChangeRole = (participant) => {
        if (participant.user_id === currentUserId) return false;
        if (isCreator(participant)) return false;
        return true;
    };

    const handleClose = () => {
        if (window.preserveHighlights) {
            window.preserveHighlights();
        }
        onClose();
        setTimeout(() => {
            if (window.restoreHighlights) {
                window.restoreHighlights();
            }
            if (window.refreshAllHighlights) {
                window.refreshAllHighlights();
            }
        }, 50);
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-backdrop"></div>
            <div className="modal-container" onClick={handleModalClick}>
                <div className="modal-header">
                    <h3 className="modal-title">Участники сессии</h3>
                    <button onClick={handleClose} className="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                {loading ? (
                    <div className="participants-loading">Загрузка...</div>
                ) : (
                    <div className="participants-list">
                        {participants.map(participant => (
                            <div key={participant.id} className="participant-item">
                                <div className="participant-avatar">
                                    {participant.user?.name?.[0] || '?'}
                                </div>
                                
                                <div className="participant-info">
                                    <p className="participant-name">
                                        {participant.user?.name} {participant.user?.last_name}
                                        {participant.user_id === currentUserId && ' (Вы)'}
                                    </p>
                                    <p className="participant-role">
                                        {participant.role_id === 2 ? 'Учитель' : 'Ученик'}
                                    </p>
                                </div>
                                
                                {canChangeRole(participant) && (
                                    <select
                                        value={participant.role_id}
                                        onChange={(e) => handleRoleChange(participant.user_id, parseInt(e.target.value))}
                                        disabled={updating}
                                        className="participant-role-select"
                                    >
                                        <option value={1}>Ученик</option>
                                        <option value={2}>Учитель</option>
                                    </select>
                                )}
                                
                                {isCreator(participant) && (
                                    <span className="participant-badge">
                                        Создатель
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="participants-modal-footer">
                    <button onClick={handleClose} className="participants-modal-button">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}