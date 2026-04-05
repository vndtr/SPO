import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReaderHeader from '../components/readerComps/ReaderHeader.jsx';
import SessionReaderAside from '../components/readerComps/SessionReaderAside.jsx';
import SelectionMenu from '../components/readerComps/SelectionMenu.jsx';
import BookReader from '../utils/BookReader.jsx';
import ErrorBoundary from '../components/UI/ErrorBoundary.jsx';
import ParticipantsModal from '../components/readerComps/ParticipantsModal.jsx';
import SessionReaderModal from '../components/readerComps/SessionReaderModal.jsx';
import ReaderSettingsModal from '../components/readerComps/ReaderSettingsModal.jsx';
import { 
  getCurrentUser,
  getSessionById,
  createSessionNote,
  createSessionQuote,
  deleteSessionNote,
  deleteSessionQuote,
  updateSessionNote,
  createAnswer,
  getSessionParticipants,
  joinSessionByLink,
  getSessionAnnotations,
   getUserSettings,
    updateUserSettings 
} from '../services/api';

export default function SessionReaderView() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const sessionName = searchParams.get('name') || 'Сессия';
  const link = searchParams.get('link');
  const highlightNoteId = searchParams.get('highlightNoteId');
  
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [readerSettings, setReaderSettings] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
const [showSettingsModal, setShowSettingsModal] = useState(false);
const [highlightedNoteId, setHighlightedNoteId] = useState(null);
  const menuRef = useRef(null);
  const wsRef = useRef(null);


  const refreshAnnotations = async () => {
    if (!session?.id) return;
    try {
        const data = await getSessionAnnotations(session.id);
        const notes = (data.notes || []).map(n => ({ 
            ...n, 
            type: 'note',
            author_id: n.author_id,
            author: { id: n.author_id, name: n.author_name, role: n.author_role }
        }));
        const quotes = (data.quotes || []).map(q => ({ ...q, type: 'quote' }));
        const allAnnotations = [...notes, ...quotes];
        
        // Обновляем через глобальную функцию
        if (window.updateBookReaderAnnotations) {
            window.updateBookReaderAnnotations(allAnnotations);
        }
    } catch (err) {
        console.error('Error refreshing annotations:', err);
    }
};

  useEffect(() => {
    loadData();
  }, [sessionId]);

  const loadData = async () => {
    setLoading(true);
    try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        
        if (sessionId) {
            const sessionData = await getSessionById(sessionId);
            setSession(sessionData);
            
            const participants = await getSessionParticipants(sessionId);
            const currentParticipant = participants.find(p => p.user_id === user?.user_id);
            setUserRole(currentParticipant?.role_id === 2 ? 'teacher' : 'student');
            
            if (link && !currentParticipant) {
                await joinSessionByLink(link, sessionId);
            }
            

            await refreshAnnotations();
        }
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        setLoading(false);
    }
};

  const handleTextSelected = (data) => {
    setSelectedText(data.text);
    setPendingSelection({
      text: data.text,
      startIndex: data.startIndex,
      endIndex: data.endIndex,
      range: data.range,
      rect: data.rect
    });
    setMenuPosition({
      top: data.rect.top,
      left: data.rect.left,
      width: data.rect.width
    });
    setShowMenu(true);
  };

  const loadSettings = async () => {
    try {
        const settings = await getUserSettings();
        setReaderSettings(settings);
    } catch (error) {
        console.error('Error loading settings:', error);
    }
};

useEffect(() => {
    if (currentUser) {
        loadSettings();
    }
}, [currentUser]);

useEffect(() => {
    const handleSettingsChange = (event) => {
        if (event.detail) {
            setReaderSettings(event.detail);
        }
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
}, []);

// frontend/src/pages/SessionReaderView.jsx
console.log('Highlight note ID from URL:', highlightNoteId);

useEffect(() => {
    if (highlightNoteId) {
        console.log('Setting highlighted note ID:', highlightNoteId);
        setHighlightedNoteId(parseInt(highlightNoteId));
        // Сбрасываем параметр из URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('highlightNoteId');
        window.history.replaceState({}, '', `${window.location.pathname}?${newParams}`);
    }
}, [highlightNoteId]);

useEffect(() => {
    if (highlightedNoteId && !loading) {
        console.log('Scrolling to note:', highlightedNoteId);
        setTimeout(() => {
            scrollToNote(highlightedNoteId);
        }, 1000);
    }
}, [highlightedNoteId, loading]);

const scrollToNote = (noteId) => {
    console.log('Looking for element:', `note-${noteId}`);
    const noteElement = document.getElementById(`note-${noteId}`);
    console.log('Found element:', noteElement);
    
    if (noteElement) {
        noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        noteElement.classList.add('highlight-flash');
        setTimeout(() => {
            noteElement.classList.remove('highlight-flash');
        }, 2000);
    const showRepliesButton = noteElement.querySelector('.show-replies-button');
    if (showRepliesButton && showRepliesButton.textContent.includes('Показать ответы')) {
            showRepliesButton.click();
        }
    
    } else {
        // Если элемент не найден, пробуем найти после загрузки аннотаций
        setTimeout(() => {
            const retryElement = document.getElementById(`note-${noteId}`);
            if (retryElement) {
                retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                retryElement.classList.add('highlight-flash');
                setTimeout(() => {
                    retryElement.classList.remove('highlight-flash');
                }, 2000);
            }
        }, 500);
    }
};

  const handleQuote = async (color) => {
    
  
  if (!pendingSelection || !session || !currentUser) {
   
    return;
  }
    
    try {
      const quoteData = {
        session_id: session.id,
        selected_text: pendingSelection.text,
        color: color,
        start_index: pendingSelection.startIndex,
        end_index: pendingSelection.endIndex
      };
      
      const savedQuote = await createSessionQuote(quoteData);
      
      if (window.applyHighlightToCurrentPage) {
        window.applyHighlightToCurrentPage({
          id: savedQuote.id,
          type: 'quote',
          color: color,
          start_index: pendingSelection.startIndex,
          end_index: pendingSelection.endIndex,
          selected_text: pendingSelection.text
        });
      }
      
      setShowMenu(false);
      setPendingSelection(null);
      window.getSelection()?.removeAllRanges();
      window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
      
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Ошибка при создании цитаты');
    }
  };

  const handleNoteClick = () => {
    setShowMenu(false);
    setShowNoteModal(true);
  };

  const handleAddNote = async (color, comment, visibility) => {
    if (!pendingSelection || !session || !currentUser) return;
    
    try {
      const noteData = {
        session_id: session.id,
        selected_text: pendingSelection.text,
        comment: comment,
        color: color,
        is_private: visibility === 'private',
        start_index: pendingSelection.startIndex,
        end_index: pendingSelection.endIndex
      };
      
      const savedNote = await createSessionNote(noteData);
      
      if (window.applyHighlightToCurrentPage) {
        window.applyHighlightToCurrentPage({
          id: savedNote.id,
          type: 'note',
          color: color,
          start_index: pendingSelection.startIndex,
          end_index: pendingSelection.endIndex,
          comment: comment,
          selected_text: pendingSelection.text,
          is_private: visibility === 'private',
          author_id: currentUser.user_id
        });
      }
      
      setShowNoteModal(false);
      setPendingSelection(null);
      window.getSelection()?.removeAllRanges();
      window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
      
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Ошибка при создании заметки');
    }
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    setShowMenu(false);
    setPendingSelection(null);
  };

  const handleSettingsApplied = (newSettings) => {
    setReaderSettings(newSettings);
};

  const openEditModal = (id, type, currentColor, currentComment, selectedText, currentVisibility, startIndex, endIndex) => {
  if (type !== 'note') {
    alert('Редактирование доступно только для заметок');
    return;
  }
  setEditingNote({ 
    id, 
    color: currentColor, 
    comment: currentComment, 
    selected_text: selectedText, 
    visibility: currentVisibility,
    start_index: startIndex,
    end_index: endIndex
  });
};

  const handleEditNote = async (color, comment, visibility) => {
  if (!editingNote) return;
  
  try {
    const updateData = {
      id: editingNote.id,
      session_id: session.id,
      comment: comment,
      color: color,
      is_private: visibility === 'private',
      selected_text: editingNote.selected_text,
      start_index: editingNote.start_index,
      end_index: editingNote.end_index
    };
    
    await updateSessionNote(updateData);
    
    // Обновляем аннотацию в состоянии BookReader
    if (window.updateAnnotationInState) {
      window.updateAnnotationInState(editingNote.id, color, comment, visibility);
    }
    
    // Перерисовываем все подсветки
    if (window.refreshAllHighlights) {
      setTimeout(() => {
        window.refreshAllHighlights();
      }, 50);
    }
    
    setEditingNote(null);
    window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
    
  } catch (error) {
    console.error('Error editing note:', error);
    alert('Ошибка при редактировании');
  }
};

  const handleDeleteAnnotation = async (id, type) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту аннотацию?')) return;
    
    try {
        if (type === 'note') {
            await deleteSessionNote(id, session.id);
        } else {
            await deleteSessionQuote(id, session.id);
        }
        
        // Удаляем подсветку из текста
        if (window.removeHighlightFromPage) {
            window.removeHighlightFromPage(id);
        }
        
        // Обновляем аннотации в боковой панели через глобальное событие
        window.dispatchEvent(new CustomEvent('sessionAnnotationsUpdated'));
        
        // Обновляем аннотации в BookReader
        if (window.updateBookReaderAnnotations) {
            // Получаем свежий список аннотаций
            const data = await getSessionAnnotations(session.id);
            const notes = (data.notes || []).map(n => ({ 
                ...n, 
                type: 'note',
                author_id: n.author_id,
                author: { id: n.author_id, name: n.author_name, role: n.author_role }
            }));
            const quotes = (data.quotes || []).map(q => ({ ...q, type: 'quote' }));
            const allAnnotations = [...notes, ...quotes];
            
            window.updateBookReaderAnnotations(allAnnotations);
        }
        
        // Перерисовываем подсветки
        setTimeout(() => {
            if (window.refreshAllHighlights) {
                window.refreshAllHighlights();
            }
        }, 100);
        
    } catch (error) {
        console.error('Error deleting annotation:', error);
        alert('Ошибка при удалении: ' + (error.response?.data?.detail || error.message));
    }
};

const handleShowParticipants = () => {
    setShowParticipants(true);
};

  const handleAddReply = async (noteId, replyText) => {
    try {
      await createAnswer(noteId, replyText, session.id);
      refreshAnnotations();
      // Обновляем ответы конкретной заметки
        if (window.refreshNoteAnswers) {
            window.refreshNoteAnswers(noteId);
        }
    } catch (error) {
        console.error('Error creating reply:', error);
        alert('Ошибка при создании ответа');
    }
};

  const handleAnnotationClick = async (annotationId, startIndex) => {
    if (window.scrollToAnnotation) {
      await window.scrollToAnnotation(annotationId, startIndex);
    }
  };

  const handleToggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
  
  // После изменения видимости панели перерисовываем подсветки
  setTimeout(() => {
    if (window.refreshAllHighlights) {
      window.refreshAllHighlights();
    }
  }, 100);
};



const refreshParticipants = async () => {
    if (!session?.id) return;
    try {
        const participants = await getSessionParticipants(session.id);
        const currentParticipant = participants.find(p => p.user_id === currentUser?.user_id);
        setUserRole(currentParticipant?.role_id === 2 ? 'teacher' : 'student');
    } catch (error) {
        console.error('Error refreshing participants:', error);
    }
};

// Добавьте глобальную функцию для доступа из ParticipantsModal
useEffect(() => {
    window.refreshParticipants = refreshParticipants;
    return () => {
        delete window.refreshParticipants;
    };
}, [session?.id, currentUser?.user_id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
        setPendingSelection(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  useEffect(() => {
    const handleUpdate = () => {
        // Обновляем данные через перезагрузку аннотаций в SessionReaderAside
        window.dispatchEvent(new CustomEvent('forceReloadAnnotations'));
    };
    
    window.addEventListener('sessionAnnotationsUpdated', handleUpdate);
    return () => window.removeEventListener('sessionAnnotationsUpdated', handleUpdate);
}, [sessionId]);

  // WebSocket для real-time обновлени

useEffect(() => {
    if (!session?.id) return;
    
    const token = localStorage.getItem('access_token');
    if (!token) {
        console.error('No token for WebSocket');
        return;
    }
    
    const ws = new WebSocket(`ws://localhost:5000/ws/session/${session.id}?token=${encodeURIComponent(token)}`);
    
    ws.onopen = () => {
        console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'role_changed') {
            // Если роль изменилась у текущего пользователя
            if (data.user_id === currentUser?.user_id) {
                // Обновляем роль текущего пользователя
                setUserRole(data.new_role_id === 2 ? 'teacher' : 'student');
            }
            // Обновляем список участников
            if (window.refreshParticipants) {
                window.refreshParticipants();
            }
        }
        
        refreshAnnotations();
    } catch (e) {
        console.error('Error parsing WebSocket message:', e);
    }
};
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };
    
    ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
    };
    
    wsRef.current = ws;
    
    return () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.close();
        }
    };
}, [session?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">Загрузка...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-red-500">
          <p>Сессия не найдена</p>
          <button onClick={() => window.history.back()} className="mt-4 px-4 py-2 bg-accent-1 text-beige-1 rounded">
            Вернуться
          </button>
        </div>
      </div>
    );
  }


  return (
    
    <div className='relative h-screen flex flex-col'>
      <ReaderHeader 
        isSession={true}
    onToggleSidebar={handleToggleSidebar}
    isSidebarOpen={isSidebarOpen}
    bookTitle={sessionName}
    sessionId={session.id}
    currentUserId={currentUser?.user_id}
    onShowParticipants={handleShowParticipants}
    globalSettings={readerSettings} 
    onSettingsClick={() => setShowSettingsModal(true)} 
      />
      
      <div className='flex flex-1 min-h-0'>
        {isSidebarOpen && (
          <SessionReaderAside 
            showNoteModal={showNoteModal}
            onCloseNoteModal={handleCloseNoteModal}
            selectedText={selectedText}
            sessionId={session.id}
            onAddNote={handleAddNote}
            onAddReply={handleAddReply}
            onDeleteAnnotation={handleDeleteAnnotation}
            onAnnotationClick={handleAnnotationClick}
            currentUser={currentUser}
            userRole={userRole}
            onEditAnnotation={openEditModal}
            highlightedNoteId={highlightedNoteId}
          />
        )}

    <main 
    className="flex-1  p-10 overflow-y-auto" 
    style={{ 
        backgroundColor: readerSettings?.background_color === 'dark' ? '#2a2a2a' 
            : readerSettings?.background_color === 'beige' ? '#f5f0e8' 
            : '#ffffff'
    }}
>
          <ErrorBoundary>
            <BookReader 
              bookId={session.book_id}
              soloSessionId={null}
              sessionId={session.id}
              onTextSelected={handleTextSelected}
              onAnnotationClick={handleAnnotationClick}
               settings={readerSettings}
              currentUser={currentUser}
            />
          </ErrorBoundary>
        </main>
      </div>

      {showMenu && (
        <SelectionMenu 
          ref={menuRef}
          position={menuPosition}
          onClose={() => {
            setShowMenu(false);
            setPendingSelection(null);
          }}
          onQuote={handleQuote}
          onNoteClick={handleNoteClick}
          selectedText={selectedText}
        />
      )}

      {/* Модальное окно для создания заметки */}
      {showNoteModal && (
        <SessionReaderModal
          onClose={handleCloseNoteModal}
          selectedText={selectedText}
          onAddNote={handleAddNote}
          isEdit={false}
        />
      )}

      {/* Модальное окно для редактирования заметки */}
      {editingNote && (
        <SessionReaderModal
          onClose={() => setEditingNote(null)}
          selectedText={editingNote.selected_text}
          initialComment={editingNote.comment}
          initialColor={editingNote.color}
          initialVisibility={editingNote.visibility}
          onAddNote={handleEditNote}
          isEdit={true}
        />
      )}
      {/* Модальное окно участников */}

{showParticipants && (
    <ParticipantsModal 
        sessionId={session.id}
        currentUserId={currentUser?.user_id}
        onClose={() => {
            setShowParticipants(false);
            // Восстанавливаем подсветки после закрытия
            setTimeout(() => {
                if (window.refreshAllHighlights) {
                    window.refreshAllHighlights();
                }
            }, 50);
        }}
    />
)}
{showSettingsModal && (
    <ReaderSettingsModal
        onClose={() => setShowSettingsModal(false)}
        onSettingsApplied={handleSettingsApplied}
    />
)}
    </div>
  );
}