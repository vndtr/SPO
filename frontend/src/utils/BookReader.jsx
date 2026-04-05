import React, { useState, useEffect, useRef } from 'react';
import { getBookPage, getSoloAnnotations, getSessionAnnotations } from '../services/api';
import { updateSoloProgress, getSoloProgress, updateSessionProgress, getSessionProgress } from '../services/api';
import '../styles/components/reader.css';
import '../styles/components/annotations.css';

export default function BookReader({ 
  bookId, 
  soloSessionId,
  sessionId,
  onTextSelected, 
  onAnnotationClick, 
  settings,
  currentUser,
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [content, setContent] = useState('');
  const [fullText, setFullText] = useState('');
  const [pageStartIndex, setPageStartIndex] = useState(0);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isInitializedRef = useRef(false);
  const containerRef = useRef(null);
  const initialLoadRef = useRef(false);
  const isSelectingRef = useRef(false);

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

  const getQuoteColorClass = (color) => {
    const classes = {
      yellow: 'highlighted-quote yellow',
      green: 'highlighted-quote green',
      blue: 'highlighted-quote blue',
      pink: 'highlighted-quote pink'
    };
    return classes[color] || 'highlighted-quote yellow';
  };

  const getNoteColorClass = (color) => {
    const classes = {
      yellow: 'highlighted-note yellow',
      green: 'highlighted-note green',
      blue: 'highlighted-note blue',
      pink: 'highlighted-note pink'
    };
    return classes[color] || 'highlighted-note yellow';
  };

  const applyHighlight = (span, annotation, isOwn = true) => {
    const type = annotation.type || (annotation.comment ? 'note' : 'quote');
    
    if (type === 'quote') {
      span.className = getQuoteColorClass(annotation.color);
      span.style.removeProperty('background-color');
      span.style.removeProperty('border-left');
    } else {
      if (isOwn) {
        span.className = getNoteColorClass(annotation.color);
        span.style.removeProperty('border-bottom-color');
        span.style.removeProperty('background-color');
      } else {
        span.className = 'highlighted-note-other';
      }
    }
  };

  const applyAllHighlights = () => {
    if (!containerRef.current) return;

    const currentFontSize = containerRef.current.style.fontSize;
    
    annotations.forEach(annotation => {
      if (annotation.start_index === undefined || annotation.end_index === undefined) return;
      
      const existingSpan = document.getElementById(String(annotation.id));
      if (existingSpan) return;
      
      const range = createRangeByIndices(annotation.start_index, annotation.end_index);
      if (!range || range.toString().length === 0) return;
      
      const span = document.createElement('span');
      span.id = String(annotation.id);
      span.setAttribute('data-annotation-id', annotation.id);
      
      let isOwn = false;
      if (soloSessionId) {
        isOwn = true;
      } else if (sessionId) {
        const authorId = annotation.author_id || annotation.author?.id;
        isOwn = authorId === currentUser?.user_id;
      }
      
      applyHighlight(span, annotation, isOwn);
      
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
    if (currentFontSize && settings) {
      setTimeout(() => {
        if (window.forceApplyStyles) {
          window.forceApplyStyles();
        }
      }, 10);
  };
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

      if (soloSessionId) {
        await updateSoloProgress(soloSessionId, page);
        window.dispatchEvent(new CustomEvent('progressUpdated', { detail: { bookId, page } }));
      } else if (sessionId) {
        await updateSessionProgress(sessionId, page);
      }
      
      const allAnnotations = await loadAnnotationsForPage();
      
      const pageAnnotations = allAnnotations.filter(ann => 
        ann.start_index >= data.start_index && ann.end_index <= data.end_index
      );
      
      setAnnotations(pageAnnotations);
      
      setTimeout(() => {
        if (containerRef.current && settings) {
          applyTextStyles();
        }
      }, 100);
      
    } catch (err) {
      console.error('Error loading page:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyTextStyles = () => {
    if (!containerRef.current || !settings) return;
    
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
  };

  useEffect(() => {
    if (bookId && !initialLoadRef.current) {
      initialLoadRef.current = true;
      const savedPage = localStorage.getItem(`book_${bookId}_page`);
      const pageToLoad = savedPage ? parseInt(savedPage) : 0;
      loadPage(pageToLoad);
    }
  }, [bookId]);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        if (soloSessionId) {
          const lastPage = await getSoloProgress(soloSessionId);
          if (lastPage > 0 && lastPage !== currentPage) {
            await loadPage(lastPage);
          }
        } else if (sessionId) {
          const lastPage = await getSessionProgress(sessionId);
          if (lastPage > 0 && lastPage !== currentPage) {
            await loadPage(lastPage);
          }
        }
      } catch (err) {
        console.error('Error loading progress:', err);
      }
    };
    
    if (content && !loading && totalPages > 1 && currentPage === 0) {
      loadProgress();
    }
  }, [soloSessionId, sessionId, content, loading, totalPages, currentPage]);

  useEffect(() => {
  if (content && !loading && annotations.length > 0 && !isSelectingRef.current) {
    applyAllHighlights();
  }
}, [annotations, content, loading]);

  const handleTextSelection = () => {
    isSelectingRef.current = true;
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
    setTimeout(() => {
    isSelectingRef.current = false;
    }, 100);
  };

  // Глобальные функции для работы с подсветками
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
      
      const isOwn = annotation.author_id === currentUser?.user_id;
      applyHighlight(span, annotation, isOwn);
      
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
        
        let isOwn = false;
        if (soloSessionId) {
          isOwn = true;
        } else if (sessionId) {
          const authorId = annotation.author_id || annotation.author?.id;
          isOwn = authorId === currentUser?.user_id;
        }
        
        applyHighlight(span, annotation, isOwn);
        
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

  window.forceApplyStyles = () => {
  if (isSelectingRef.current) return;
  if (!containerRef.current || !settings) return;
  
  const fontSizeMap = { 12: '12px', 14: '14px', 16: '16px', 18: '18px' };
  const fontSizeValue = typeof settings.font_size === 'string' ? parseInt(settings.font_size) : settings.font_size;
  const fontSize = fontSizeMap[fontSizeValue] || '14px';
  
  const textColors = { light: '#374151', dark: '#e0e0e0', beige: '#4a4a4a' };
  const textColor = textColors[settings.background_color] || '#374151';
  
  const allElements = containerRef.current.querySelectorAll('*');
  allElements.forEach(el => {
    el.style.fontSize = fontSize;
    el.style.color = textColor;
  });
  
  const paragraphs = containerRef.current.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.style.fontSize = fontSize;
    p.style.color = textColor;
    p.style.lineHeight = '1.6';
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
      delete window.forceApplyStyles;
      observer.disconnect();
    };
  }, [totalPages, currentPage, annotations, content, loading, pageStartIndex, fullText, currentUser, onAnnotationClick, soloSessionId, sessionId]);

  // Применяем настройки после загрузки контента
  useEffect(() => {
    if (content && containerRef.current && settings) {
      applyTextStyles();
    }
  }, [content, settings]);

  // Применяем настройки при их изменении
  useEffect(() => {
    if (containerRef.current && settings) {
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
      
      const savedHighlights = saveCurrentHighlights();
      
      const fontSizeMap = { 12: '12px', 14: '14px', 16: '16px', 18: '18px' };
      const fontSizeValue = typeof settings.font_size === 'string' ? parseInt(settings.font_size) : settings.font_size;
      const fontSize = fontSizeMap[fontSizeValue] || '14px';
      
      const bgColors = { light: '#ffffff', dark: '#2a2a2a', beige: '#f5f0e8' };
      const textColors = { light: '#374151', dark: '#e0e0e0', beige: '#4a4a4a' };
      
      const bgColor = bgColors[settings.background_color] || '#ffffff';
      const textColor = textColors[settings.background_color] || '#374151';
      
      containerRef.current.style.backgroundColor = bgColor;
      containerRef.current.style.fontSize = fontSize;
      
      const allElements = containerRef.current.querySelectorAll('*');
      allElements.forEach(el => {
        el.style.fontSize = fontSize;
        el.style.color = textColor;
      });
      
      setTimeout(() => {
        restoreHighlights(savedHighlights);
        if (window.refreshAllHighlights) {
          window.refreshAllHighlights();
        }
      }, 50);
    }
  }, [settings]);

    if (loading) return <div className="reader-loading-text">Загрузка...</div>;

  return (
    <div className="reader-nav-container">
      <div className="reader-nav-buttons">
        <button 
          onClick={() => loadPage(currentPage - 1)} 
          disabled={currentPage === 0}
          className="reader-nav-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => loadPage(currentPage + 1)} 
          disabled={currentPage === totalPages - 1}
          className="reader-nav-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="reader-page-info">
        Страница {currentPage + 1} из {totalPages}
      </div>
      
      <div 
        ref={containerRef} 
        className="reader-content"
        onMouseUp={handleTextSelection}
      >
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    </div>
  );
}