// frontend/src/pages/ReaderView.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReaderHeader from '../components/readerComps/ReaderHeader.jsx';
import ReaderAside from '../components/readerComps/ReaderAside.jsx';
import SelectionMenu from '../components/readerComps/SelectionMenu.jsx';
import ReaderSettingsModal from '../components/readerComps/ReaderSettingsModal.jsx';
import BookReader from '../utils/BookReader.jsx';
import ErrorBoundary from '../components/UI/ErrorBoundary.jsx';
import ReaderModal from '../components/readerComps/ReaderModal.jsx';
import { 
  getCurrentUser,
  getSoloSession,
  createSoloSession,
  createSoloNote, 
  createSoloQuote,
  deleteSoloNote,
  deleteSoloQuote,
  updateSoloNote,
  getUserSettings,
  updateUserSettings
} from '../services/api';

export default function ReaderView() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const bookTitle = searchParams.get('title') || 'Чтение книги';
  const bookAuthor = searchParams.get('author') || '';
  
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedText, setSelectedText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [readerSettings, setReaderSettings] = useState(null);
  const [soloSession, setSoloSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const menuRef = useRef(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
const [editingAnnotation, setEditingAnnotation] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
        const user = await getCurrentUser();
        setCurrentUser(user);
        if (user) {
            await loadSettings(); // Загружаем настройки из БД после получения пользователя
        }
    } catch (error) {
        console.error('Error loading user:', error);
    }
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
    if (bookId && currentUser) {
      loadSoloSession();
    }
  }, [bookId, currentUser]);

  const loadSoloSession = async () => {
    if (!currentUser?.user_id) return;
    
    try {
      setLoading(true);
      let session = await getSoloSession(bookId);
      
      if (!session || !session.id) {
        session = await createSoloSession(bookId);
      }
      setSoloSession(session);
    } catch (error) {
      console.error('Error loading solo session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSettingsChange = (event) => {
        if (event.detail) {
            setReaderSettings(event.detail);
        }
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
}, []);

  const handleSettingsChange = async (newSettings) => {
    try {
      await updateUserSettings(newSettings);
      setReaderSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
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

  const handleQuote = async (color) => {
  if (!pendingSelection || !soloSession || !currentUser) return;
  
  try {
    const quoteData = {
      solo_session_id: soloSession.id,
      selected_text: pendingSelection.text,
      color: color,
      start_index: pendingSelection.startIndex,
      end_index: pendingSelection.endIndex
    };
    
    const savedQuote = await createSoloQuote(quoteData);
    
    // Мгновенное применение подсветки для цитаты
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
    window.dispatchEvent(new CustomEvent('personalAnnotationsUpdated'));
    
  } catch (error) {
    console.error('Error creating quote:', error);
    alert('Ошибка при создании цитаты');
  }
};

  const handleNoteClick = () => {
    setShowMenu(false);
    setShowNoteModal(true);
  };

  const handleAddNote = async (color, comment) => {
  if (!pendingSelection || !soloSession || !currentUser) return;
  
  try {
    const noteData = {
      solo_session_id: soloSession.id,
      selected_text: pendingSelection.text,
      comment: comment,
      color: color,
      start_index: pendingSelection.startIndex,
      end_index: pendingSelection.endIndex
    };
    
    const savedNote = await createSoloNote(noteData);
    
    // Мгновенное применение подсветки
    if (window.applyHighlightToCurrentPage) {
      window.applyHighlightToCurrentPage({
        id: savedNote.id,
        type: 'note',
        color: color,
        start_index: pendingSelection.startIndex,
        end_index: pendingSelection.endIndex,
        comment: comment,
        selected_text: pendingSelection.text
      });
    }
    
    setShowNoteModal(false);
    setPendingSelection(null);
    window.getSelection()?.removeAllRanges();
    window.dispatchEvent(new CustomEvent('personalAnnotationsUpdated'));
    
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

  const handleDeleteAnnotation = async (id, type) => {
  if (!window.confirm('Вы уверены, что хотите удалить эту аннотацию?')) {
    return;
  }
  
  try {
    if (type === 'note') {
      await deleteSoloNote(id, soloSession.id);
    } else {
      await deleteSoloQuote(id, soloSession.id);
    }
    
    // Мгновенное удаление подсветки
    if (window.removeHighlightFromPage) {
      window.removeHighlightFromPage(id);
    }
    
    window.dispatchEvent(new CustomEvent('personalAnnotationsUpdated'));
  } catch (error) {
    console.error('Error deleting annotation:', error);
    alert('Ошибка при удалении');
  }
};

  const handleAnnotationClick = async (annotationId, startIndex) => {
    if (window.scrollToAnnotation) {
      const success = await window.scrollToAnnotation(annotationId, startIndex);
      if (success) return;
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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  const openEditModal = (id, type, currentColor, currentComment, selectedText) => {
  if (type !== 'note') {
    alert('Редактирование доступно только для заметок');
    return;
  }
  setEditingAnnotation({ id, color: currentColor, comment: currentComment, selected_text: selectedText });
  setEditModalOpen(true);
};

const handleEditNote = async (color, comment) => {
  if (!editingAnnotation) return;
  
  try {
    const updateData = {
      id: editingAnnotation.id,
      solo_session_id: soloSession.id,
      comment: comment,
      color: color,
      selected_text: editingAnnotation.selected_text,
      start_index: editingAnnotation.start_index,
      end_index: editingAnnotation.end_index
    };
    
    await updateSoloNote(updateData);
    
    // Обновляем аннотацию в состоянии
    if (window.updateAnnotation) {
      window.updateAnnotation(editingAnnotation.id, color, comment);
    }
    
    // Перерисовываем все подсветки
    if (window.refreshAllHighlights) {
      console.log('Calling refreshAllHighlights');
      setTimeout(() => {
        window.refreshAllHighlights();
      }, 50);
    }
    
    setEditModalOpen(false);
    setEditingAnnotation(null);
    window.dispatchEvent(new CustomEvent('personalAnnotationsUpdated'));
    
  } catch (error) {
    console.error('Error editing note:', error);
    alert('Ошибка при редактировании');
  }
};

  return (
    <div className='relative h-screen flex flex-col'>
      <ReaderHeader 
        isSession={false} 
    onSettingsClick={() => setShowSettingsModal(true)}
    onToggleSidebar={handleToggleSidebar}
    isSidebarOpen={isSidebarOpen}
    bookTitle={bookTitle}
    bookAuthor={bookAuthor}
    globalSettings={readerSettings}
      />
      
      <div className='flex flex-1 min-h-0'>
        {isSidebarOpen && (
          <ReaderAside 
            showNoteModal={showNoteModal}
            onCloseNoteModal={handleCloseNoteModal}
            selectedText={selectedText}
            soloSessionId={soloSession?.id}
            onAddNote={handleAddNote}
            onDeleteAnnotation={handleDeleteAnnotation}
            onAnnotationClick={handleAnnotationClick}
             onEditAnnotation={openEditModal}

          />
        )}

        <main 
    className="flex-1 p-10 overflow-y-auto" 
    style={{ 
        backgroundColor: readerSettings?.background_color === 'dark' ? '#2a2a2a' 
            : readerSettings?.background_color === 'beige' ? '#f5f0e8' 
            : '#ffffff'
    }}
>
    {bookId && soloSession ? (
            <ErrorBoundary>
              <BookReader 
                bookId={bookId}
                soloSessionId={soloSession.id}
                onTextSelected={handleTextSelected}
                onAnnotationClick={handleAnnotationClick}
                settings={readerSettings}
                currentUser={currentUser}
              />
            </ErrorBoundary>
          ) : (
            <div className="text-center text-red-500 p-10">
              <p>Ошибка: не удалось загрузить книгу</p>
              <button 
                onClick={() => window.history.back()}
                className="mt-4 px-4 py-2 bg-accent-1 text-beige-1 rounded"
              >
                Вернуться назад
              </button>
            </div>
          )}
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

      {showSettingsModal && (
        <ReaderSettingsModal
          onClose={() => setShowSettingsModal(false)}
          onSettingsChange={handleSettingsChange}
          currentSettings={readerSettings}
        />
      )}
      {editModalOpen && editingAnnotation && (
  <ReaderModal
    onClose={() => {
      setEditModalOpen(false);
      setEditingAnnotation(null);
    }}
    selectedText={editingAnnotation.selected_text}
    initialComment={editingAnnotation.comment}
    initialColor={editingAnnotation.color}
    onAddNote={handleEditNote}
    isEdit={true}
  />
)}
    </div>
  );
}