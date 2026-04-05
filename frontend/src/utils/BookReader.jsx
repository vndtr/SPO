// frontend/src/components/readerComps/BookReader.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getBookPage, getSoloAnnotations, getSessionAnnotations } from '../services/api';

export default function BookReader({ 
  bookId, 
  soloSessionId,
  sessionId,
  onTextSelected, 
  onAnnotationClick, 
  settings,
  currentUser,
}) {
  console.log('BookReader mounted with settings:', settings);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [content, setContent] = useState('');
  const [fullText, setFullText] = useState('');
  const [pageStartIndex, setPageStartIndex] = useState(0);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const wsRef = useRef(null);

  const getGlobalIndex = (node, offset) => {
    if (!containerRef.current) return 0;
    const range = document.createRange();
    range.setStart(containerRef.current, 0);
    range.setEnd(node, offset);
    const localIndex = range.toString().length;
    return pageStartIndex + localIndex;
  };

  const createRangeByIndices = (startGlobal, endGlobal) => {
    if (!containerRef.current) return null;
    
    const startLocal = startGlobal - pageStartIndex;
    const endLocal = endGlobal - pageStartIndex;
    
    if (startLocal < 0 || endLocal > fullText.length || startLocal >= endLocal) return null;
    
    const range = document.createRange();
    let currentPos = 0;
    
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let startNode = null, startOffset = 0;
    let endNode = null, endOffset = 0;
    let node;
    
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent.length;
      const nodeStart = currentPos;
      const nodeEnd = currentPos + nodeLength;
      
      if (!startNode && startLocal >= nodeStart && startLocal <= nodeEnd) {
        startNode = node;
        startOffset = startLocal - nodeStart;
      }
      if (!endNode && endLocal >= nodeStart && endLocal <= nodeEnd) {
        endNode = node;
        endOffset = endLocal - nodeStart;
      }
      
      currentPos += nodeLength;
      if (startNode && endNode) break;
    }
    
    if (startNode && endNode) {
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);
      return range;
    }
    return null;
  };

  const getQuoteColor = (color) => {
    const colors = {
      yellow: '#fef9c3',
      green: '#bbf7d0',
      blue: '#bfdbfe',
      pink: '#fce7f3'
    };
    return colors[color] || '#fef9c3';
  };

  const getNoteColor = (color) => {
    const colors = {
      yellow: '#fbbf24',
      green: '#4ade80',
      blue: '#60a5fa',
      pink: '#f472b6'
    };
    return colors[color] || '#fbbf24';
  };

  const applyAllHighlights = () => {
    if (!containerRef.current) return;
    
    annotations.forEach(annotation => {
      if (annotation.start_index === undefined || annotation.end_index === undefined) return;
      
      const existingSpan = document.getElementById(String(annotation.id));
      if (existingSpan) return;
      
      const range = createRangeByIndices(annotation.start_index, annotation.end_index);
      if (!range || range.toString().length === 0) return;
      
      const span = document.createElement('span');
      span.id = String(annotation.id);
      span.setAttribute('data-annotation-id', annotation.id);
      
      const type = annotation.type || (annotation.comment ? 'note' : 'quote');
      
      if (type === 'quote') {
        span.className = 'highlighted-quote';
        span.style.backgroundColor = getQuoteColor(annotation.color);
      } else {
        let isOwn = false;
  if (soloSessionId) {
    isOwn = true; // В личном чтении все заметки принадлежат текущему пользовате
        
         } else if (sessionId) {
    const authorId = annotation.author_id || annotation.author?.id;
    isOwn = authorId === currentUser?.user_id;
  }
  
  if (isOwn) {
    span.className = 'highlighted-note';
    span.style.borderBottom = `3px solid ${getNoteColor(annotation.color)}`;
  } else {
    span.className = 'highlighted-note-other';
    span.style.borderBottom = '2px dashed #9ca3af';
    span.style.paddingBottom = '2px';
  }
}
      
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        onAnnotationClick(annotation.id, annotation.start_index);
      });
      
      try {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
      } catch (e) {
        console.error('Failed to apply highlight:', e);
      }
    });
  };

  const loadAnnotationsForPage = async () => {
    if (soloSessionId) {
      const annData = await getSoloAnnotations(soloSessionId);
      const notes = (annData.notes || []).map(n => ({ 
        ...n, 
        type: 'note', 
        comment: n.comment || '' 
      }));
      const quotes = (annData.quotes || []).map(q => ({ 
        ...q, 
        type: 'quote', 
        comment: null 
      }));
      return [...notes, ...quotes];
    } else if (sessionId) {
      const annData = await getSessionAnnotations(sessionId);
      const notes = (annData.notes || []).map(n => ({ 
        ...n, 
        type: 'note', 
        comment: n.comment || '',
        author_id: n.author_id
      }));
      const quotes = (annData.quotes || []).map(q => ({ 
        ...q, 
        type: 'quote', 
        comment: null 
      }));
      return [...notes, ...quotes];
    }
    return [];
  };

  const loadPage = async (page) => {
    try {
        setLoading(true);
        const data = await getBookPage(bookId, page);
        
        setContent(data.content);
        setFullText(data.full_text || '');
        setPageStartIndex(data.start_index || 0);
        setTotalPages(data.total_pages || 1);
        setCurrentPage(page);
        
        localStorage.setItem(`book_${bookId}_page`, page);
        
        const allAnnotations = await loadAnnotationsForPage();
        
        const pageAnnotations = allAnnotations.filter(ann => 
            ann.start_index >= data.start_index && ann.end_index <= data.end_index
        );
        
        setAnnotations(pageAnnotations);
        
        // Применяем настройки после загрузки контента
        setTimeout(() => {
            if (containerRef.current && settings) {
                const fontSizeMap = { 12: '12px', 14: '14px', 16: '16px', 18: '18px' };
                const fontSizeValue = typeof settings.font_size === 'string' ? parseInt(settings.font_size) : settings.font_size;
                const fontSize = fontSizeMap[fontSizeValue] || '14px';
                
                const textColors = { light: '#374151', dark: '#e0e0e0', beige: '#4a4a4a' };
                const textColor = textColors[settings.background_color] || '#374151';
                
                const paragraphs = containerRef.current.querySelectorAll('p');
                paragraphs.forEach(p => {
                    p.style.fontSize = fontSize;
                    p.style.color = textColor;
                });
            }
        }, 100);
        
    } catch (err) {
        console.error('Error loading page:', err);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    if (content && !loading) {
      const modalOpen = document.querySelector('.fixed.inset-0');
      if (modalOpen) {
        return;
      }
      const timer = setTimeout(() => {
        applyAllHighlights();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [content, loading, annotations]);

  useEffect(() => {
    if (content && !loading && annotations.length > 0) {
      applyAllHighlights();
    }
  }, [annotations]);

  useEffect(() => {
    if (bookId) {
      const savedPage = localStorage.getItem(`book_${bookId}_page`);
      const pageToLoad = savedPage ? parseInt(savedPage) : 0;
      loadPage(pageToLoad);
    }
  }, [bookId]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const startIndex = getGlobalIndex(range.startContainer, range.startOffset);
      const endIndex = getGlobalIndex(range.endContainer, range.endOffset);
      const rect = range.getBoundingClientRect();
      
      onTextSelected({
        text,
        range,
        startIndex,
        endIndex,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        }
      });
    }
  };

  useEffect(() => {
    window.applyHighlightToCurrentPage = (annotation) => {
      if (!containerRef.current) return;
      
      const existingSpan = document.getElementById(String(annotation.id));
      if (existingSpan) return;
      
      const range = createRangeByIndices(annotation.start_index, annotation.end_index);
      if (!range || range.toString().length === 0) return;
      
      const span = document.createElement('span');
      span.id = String(annotation.id);
      span.setAttribute('data-annotation-id', annotation.id);
      
      const type = annotation.type || (annotation.comment ? 'note' : 'quote');
      
      if (type === 'quote') {
        span.className = 'highlighted-quote';
        span.style.backgroundColor = getQuoteColor(annotation.color);
      } else {
        const isOwn = annotation.author_id === currentUser?.user_id;
        
        if (isOwn) {
          span.className = 'highlighted-note';
          span.style.borderBottom = `3px solid ${getNoteColor(annotation.color)}`;
        } else {
          span.className = 'highlighted-note-other';
          span.style.borderBottom = '2px dashed #9ca3af';
          span.style.paddingBottom = '2px';
        }
      }
      
      span.addEventListener('click', (e) => {
        e.stopPropagation();
        onAnnotationClick(annotation.id, annotation.start_index);
      });
      
      try {
        const fragment = range.extractContents();
        span.appendChild(fragment);
        range.insertNode(span);
        setAnnotations(prev => {
          if (prev.find(a => a.id === annotation.id)) return prev;
          return [...prev, annotation];
        });
      } catch (e) {
        console.error('Failed to apply highlight:', e);
      }
    };
    
    window.removeHighlightFromPage = (annotationId) => {
      const element = document.getElementById(String(annotationId));
      if (element && element.parentNode) {
        const parent = element.parentNode;
        const text = element.textContent;
        const textNode = document.createTextNode(text);
        parent.replaceChild(textNode, element);
      }
      setAnnotations(prev => prev.filter(a => a.id !== annotationId));
    };
    
    window.updateAnnotationInState = (annotationId, newColor, newComment, newVisibility) => {
      setAnnotations(prev => prev.map(ann => 
        ann.id === annotationId 
          ? { ...ann, color: newColor, comment: newComment, is_private: newVisibility === 'private' }
          : ann
      ));
    };

    window.updateAnnotation = (annotationId, newColor, newComment) => {
      setAnnotations(prev => {
        const updated = prev.map(ann => {
          if (ann.id === annotationId) {
            return { ...ann, color: newColor, comment: newComment };
          }
          return ann;
        });
        return updated;
      });
    };
    
    window.refreshAllHighlights = () => {
      if (!containerRef.current) return;
      
      const existingSpans = document.querySelectorAll('span[data-annotation-id]');
      
      existingSpans.forEach(span => {
        const id = parseInt(span.getAttribute('data-annotation-id'));
        const annotationExists = annotations.some(a => a.id === id);
        if (!annotationExists && span.parentNode) {
          const parent = span.parentNode;
          const text = span.textContent;
          const textNode = document.createTextNode(text);
          parent.replaceChild(textNode, span);
        }
      });
      
      annotations.forEach(annotation => {
        const existingSpan = document.getElementById(String(annotation.id));
        if (existingSpan) return;
        
        const isOnPage = annotation.start_index >= pageStartIndex && 
                         annotation.end_index <= pageStartIndex + fullText.length;
        
        if (!isOnPage) return;
        
        const range = createRangeByIndices(annotation.start_index, annotation.end_index);
        if (!range || range.toString().length === 0) return;
        
        const span = document.createElement('span');
        span.id = String(annotation.id);
        span.setAttribute('data-annotation-id', annotation.id);
        
        const type = annotation.type || (annotation.comment ? 'note' : 'quote');
        
        if (type === 'quote') {
          span.className = 'highlighted-quote';
          span.style.backgroundColor = getQuoteColor(annotation.color);
        } else {
          const authorId = annotation.author_id || annotation.author?.id;
          let isOwn = false;
if (soloSessionId) {
  isOwn = true; // В личном чтении все заметки свои
} else if (sessionId) {
  const authorId = annotation.author_id || annotation.author?.id;
  isOwn = authorId === currentUser?.user_id;
}
          
          if (isOwn) {
    span.className = 'highlighted-note';
    span.style.borderBottom = `3px solid ${getNoteColor(annotation.color)}`;
  } else {
    span.className = 'highlighted-note-other';
    span.style.borderBottom = '2px dashed #9ca3af';
    span.style.paddingBottom = '2px';
  }
}
        
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          onAnnotationClick(annotation.id, annotation.start_index);
        });
        
        try {
          const fragment = range.extractContents();
          span.appendChild(fragment);
          range.insertNode(span);
        } catch (e) {
          console.error('Failed to apply highlight:', e);
        }
      });
    };

    window.updateBookReaderAnnotations = (newAnnotations) => {
      setAnnotations(newAnnotations);
      setTimeout(() => {
        if (window.refreshAllHighlights) {
          window.refreshAllHighlights();
        }
      }, 100);
    };
    
    window.preserveHighlights = () => {
      const allSpans = document.querySelectorAll('span[data-annotation-id]');
      const highlightsData = [];
      
      allSpans.forEach(span => {
        const annotationId = span.getAttribute('data-annotation-id');
        highlightsData.push({
          id: annotationId,
          html: span.outerHTML,
          text: span.textContent,
        });
      });
      
      window._savedHighlights = highlightsData;
    };

    window.restoreHighlights = () => {
      if (!window._savedHighlights) return;
      
      window._savedHighlights.forEach(data => {
        const existingSpan = document.getElementById(data.id);
        if (!existingSpan) {
          if (window.refreshAllHighlights) {
            window.refreshAllHighlights();
            return;
          }
        }
      });
      
      window._savedHighlights = null;
    };

    const observer = new MutationObserver(() => {
      if (window._savedHighlights) {
        window.restoreHighlights();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    window.changePage = async (page) => {
      if (page >= 0 && page < totalPages) {
        await loadPage(page);
        return true;
      }
      return false;
    };
    
    window.getCurrentPage = () => currentPage;
    window.getTotalPages = () => totalPages;
    
    window.scrollToAnnotation = async (annotationId, startIndex) => {
      let element = document.getElementById(String(annotationId));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-flash');
        setTimeout(() => element.classList.remove('highlight-flash'), 1000);
        return true;
      }
      
      const charsPerPage = 3000;
      let targetPage = Math.floor(startIndex / charsPerPage);
      
      if (targetPage !== currentPage) {
        const success = await window.changePage(targetPage);
        if (success) {
          setTimeout(() => {
            const newElement = document.getElementById(String(annotationId));
            if (newElement) {
              newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              newElement.classList.add('highlight-flash');
              setTimeout(() => newElement.classList.remove('highlight-flash'), 1000);
            }
          }, 300);
          return true;
        }
      }
      return false;
    };
    
    return () => {
      delete window.applyHighlightToCurrentPage;
      delete window.removeHighlightFromPage;
      delete window.updateAnnotationInState;
      delete window.refreshAllHighlights;
      delete window.changePage;
      delete window.getCurrentPage;
      delete window.getTotalPages;
      delete window.scrollToAnnotation;
      delete window.updateBookReaderAnnotations;
      delete window.preserveHighlights;
      delete window.restoreHighlights;
      observer.disconnect();
    };
  }, [totalPages, currentPage, annotations, content, loading, pageStartIndex, fullText, currentUser, onAnnotationClick]);
// Применяем настройки после загрузки контента (когда появляются параграфы)
useEffect(() => {
    if (content && containerRef.current && settings) {
        const fontSizeMap = {
            12: '12px',
            14: '14px',
            16: '16px',
            18: '18px'
        };
        
        const fontSizeValue = typeof settings.font_size === 'string' 
            ? parseInt(settings.font_size) 
            : settings.font_size;
        const fontSize = fontSizeMap[fontSizeValue] || '14px';
        
        const textColors = {
            light: '#374151',
            dark: '#e0e0e0',
            beige: '#4a4a4a'
        };
        const textColor = textColors[settings.background_color] || '#374151';
        
        // Применяем ко всем элементам
        const allElements = containerRef.current.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.fontSize = fontSize;
            el.style.color = textColor;
        });
        
        // Специально для параграфов
        const paragraphs = containerRef.current.querySelectorAll('p');
        paragraphs.forEach(p => {
            p.style.fontSize = fontSize;
            p.style.color = textColor;
        });
        
        console.log('Applied font size after content load:', fontSize);
    }
}, [content, settings]);
 useEffect(() => {
    if (containerRef.current && settings) {
        // Сохраняем все текущие подсветки перед изменением
        const saveCurrentHighlights = () => {
            const allSpans = document.querySelectorAll('span[data-annotation-id]');
            const savedData = [];
            allSpans.forEach(span => {
                savedData.push({
                    id: span.id,
                    html: span.outerHTML,
                    parent: span.parentNode,
                    nextSibling: span.nextSibling
                });
            });
            return savedData;
        };
        
        // Восстанавливаем подсветки после изменения
        const restoreHighlights = (savedData) => {
            savedData.forEach(data => {
                const existingSpan = document.getElementById(data.id);
                if (!existingSpan && data.parent && data.parent.parentNode) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.html;
                    const newSpan = tempDiv.firstChild;
                    if (newSpan && data.nextSibling) {
                        data.parent.insertBefore(newSpan, data.nextSibling);
                    } else if (newSpan && data.parent) {
                        data.parent.appendChild(newSpan);
                    }
                }
            });
        };
        
        // Сохраняем текущие подсветки
        const savedHighlights = saveCurrentHighlights();
        
        // Применяем новые настройки
        const fontSizeMap = {
            12: '12px',
            14: '14px',
            16: '16px',
            18: '18px'
        };

        // Преобразуем в число, если пришло строкой
const fontSizeValue = typeof settings.font_size === 'string' 
    ? parseInt(settings.font_size) 
    : settings.font_size;
        const fontSize = fontSizeMap[fontSizeValue] || '14px';
        
        const bgColors = {
            light: '#ffffff',
            dark: '#2a2a2a',
            beige: '#f5f0e8'
        };
        const textColors = {
            light: '#374151',
            dark: '#e0e0e0',
            beige: '#4a4a4a'
        };
        
        const bgColor = bgColors[settings.background_color] || '#ffffff';
        const textColor = textColors[settings.background_color] || '#374151';
        
        // Применяем к контейнеру
        containerRef.current.style.backgroundColor = bgColor;
        containerRef.current.style.fontSize = fontSize;
        
        // Применяем ко всем дочерним элементам
        const allElements = containerRef.current.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.fontSize = fontSize;
            el.style.color = textColor;
        });
        
        // Восстанавливаем подсветки после применения стилей
        setTimeout(() => {
            restoreHighlights(savedHighlights);
            // Дополнительно перерисовываем на всякий случай
            if (window.refreshAllHighlights) {
                window.refreshAllHighlights();
            }
        }, 50);
    }
}, [settings]);

  if (loading) return <div className="p-10 text-center">Загрузка...</div>;

  return (
    <div className="flex flex-col h-full">
      <div 
    className="flex justify-between items-center p-4 border-b" 
    style={{ 
        backgroundColor: settings?.background_color === 'dark' ? '#2a2a2a' 
            : settings?.background_color === 'beige' ? '#f5f0e8' 
            : '#ffffff',
        color: settings?.background_color === 'dark' ? '#e0e0e0' : '#374151',
        borderBottomColor: settings?.background_color === 'dark' ? '#4a4a4a' : '#e5e7eb'
    }}
>
        <span style={{ color: settings?.background_color === 'dark' ? '#e0e0e0' : '#374151' }}>
    Страница {currentPage + 1} из {totalPages}
</span>
        <div className="space-x-2">
          <button 
    onClick={() => loadPage(currentPage - 1)} 
    disabled={currentPage === 0}
    className="px-4 py-2 rounded disabled:opacity-50 transition-colors"
    style={{
        backgroundColor: settings?.background_color === 'dark' ? '#4a4a4a' : '#ef4444',
        color: '#ffffff'
    }}
>
    ← Назад
</button>
<button 
    onClick={() => loadPage(currentPage + 1)} 
    disabled={currentPage === totalPages - 1}
    className="px-4 py-2 rounded disabled:opacity-50 transition-colors"
    style={{
        backgroundColor: settings?.background_color === 'dark' ? '#4a4a4a' : '#ef4444',
        color: '#ffffff'
    }}
>
    Вперед →
</button>
        </div>
      </div>
      <div 
        ref={containerRef} 
        className="flex-1 overflow-y-auto p-6" 
        onMouseUp={handleTextSelection}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}