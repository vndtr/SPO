
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//  АВТОРИЗАЦИЯ 

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const response = await api.post('/auth/verify');
    if (response.data && response.data.user_id) {
      return { 
        user_id: response.data.user_id, 
        name: response.data.username,
        role: response.data.role || 'user'
      };
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
};

//КНИГИ 

export const getBooks = async () => {
  const response = await api.get('/book/');
  // Адаптируем данные под формат, ожидаемый фронтендом
  return response.data.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
    cover_img: book.cover_img,
    content_path: book.content_path,
    created_at: book.created_at
  }));
};

export const getBookById = async (bookId) => {
  const response = await api.get(`/book/${bookId}`);
  return response.data;
};

export const getBookPage = async (bookId, page) => {
  try {
    const book = await getBookById(bookId);
    if (!book || !book.content_path) {
      throw new Error('Book not found or no content path');
    }
    
    // Получаем общее количество страниц 
    let total_pages = 1;
    const cachedTotal = localStorage.getItem(`book_${bookId}_total_pages`);
    if (cachedTotal) {
      total_pages = parseInt(cachedTotal);
    } else {
      const allPagesResponse = await api.get(`/books/content/${book.content_path}`, {
        params: { offset: 0, limit: 100 }
      });
      total_pages = Object.keys(allPagesResponse.data).length;
      localStorage.setItem(`book_${bookId}_total_pages`, total_pages);
    }
    
    // Получаем конкретную страницу
    const response = await api.get(`/books/content/${book.content_path}`, {
      params: { offset: page, limit: 1 }
    });
    
    const pageData = response.data;
    const pageKeys = Object.keys(pageData);
    
    if (pageKeys.length === 0) {
      throw new Error('Page not found');
    }
    
    const pageKey = pageKeys[0];
    const pageText = pageData[pageKey];
    
    const paragraphs = pageText.split(/\n\s*\n/);
    const formattedHtml = paragraphs
      .filter(p => p.trim())
      .map(p => `<p class="mb-4 leading-relaxed">${p.trim()}</p>`)
      .join('');
    
    return {
      page: page,
      total_pages: total_pages,
      content: formattedHtml,
      full_text: pageText,
      start_index: page * 3000,
      end_index: (page + 1) * 3000
    };
  } catch (error) {
    console.error('Error loading page:', error);
    throw error;
  }
};

export const uploadBook = async (file, title, author) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('author', author);
  formData.append('book_cover', file);
  formData.append('content', file);
  
  const response = await api.post('/book/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteBook = async (bookId) => {
  const response = await api.delete(`/book/${bookId}`);
  return response.data;
};

// личное чтение

export const getSoloSession = async (bookId) => {
  try {
    const response = await api.get('/solo_session/', {
      params: { book_id: bookId }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createSoloSession = async (bookId) => {
  const response = await api.post('/solo_session/create', null, {
    params: { book_id: bookId }
  });
  return response.data;
};

export const getSoloNotes = async (soloSessionId) => {
  const response = await api.get(`/solo_session/note/${soloSessionId}`);
  return response.data;
};

export const getSoloQuotes = async (soloSessionId) => {
  const response = await api.get(`/solo_session/quote/${soloSessionId}`);
  return response.data;
};

export const getSoloAnnotations = async (soloSessionId) => {
  const [notes, quotes] = await Promise.all([
    getSoloNotes(soloSessionId),
    getSoloQuotes(soloSessionId)
  ]);
  return { notes, quotes };
};

export const createSoloNote = async (data) => {
  const response = await api.post('/solo_session/note/', data);
  return response.data;
};

export const createSoloQuote = async (data) => {
  const response = await api.post('/solo_session/quote/', data);
  return response.data;
};

export const deleteSoloNote = async (noteId, soloSessionId) => {
  const response = await api.delete('/solo_session/note/', {
    data: { id: noteId, solo_session_id: soloSessionId }
  });
  return response.data;
};

export const deleteSoloQuote = async (quoteId, soloSessionId) => {
  const response = await api.delete('/solo_session/quote/', {
    data: { id: quoteId, solo_session_id: soloSessionId }
  });
  return response.data;
};

export const updateSoloNote = async (data) => {
  const response = await api.patch('/solo_session/note/', data);
  return response.data;
};

export const getSoloProgress = async (soloSessionId) => {
    try {
        const response = await api.get(`/solo_session/${soloSessionId}/progress`);
        return response.data.last_page || 0;
    } catch (error) {
        return 0;
    }
};

export const updateSoloProgress = async (soloSessionId, page) => {
    try {
        await api.post(`/solo_session/${soloSessionId}/progress`, {
            last_page: page
        });
    } catch (error) {
        console.error('Error saving solo progress:', error);
    }
};


//СЕССИИ 

export const getSessions = async () => {
  const response = await api.get('/session/');
  const participants = response.data;
  return participants.map(p => ({
    id: p.session.id,
    name: p.session.name,
    book_id: p.session.book_id,
    is_active: p.session.is_active,
    link: p.session.link,
    role_id: p.role_id,
    user_id: p.user_id
  }));
};

export const createSession = async (data) => {
  const response = await api.post('/session/', {
    name: data.name,
    book_id: data.book_id
  });
  return response.data;
};

export const getSessionById = async (sessionId) => {
  const response = await api.get(`/session/info/${sessionId}`);
  return response.data;
};

export const getSessionInfo = async (sessionId) => {
  const sessions = await getSessions();
  return sessions.find(s => s.id === parseInt(sessionId));
};

export const getSessionParticipants = async (sessionId) => {
  const response = await api.get(`/session/${sessionId}`);
  return response.data;
};

export const joinSessionByLink = async (link, sessionId) => {
  const response = await api.post(`/session/${link}?session_id=${sessionId}`);
  return response.data;
};



export const getSessionProgress = async (sessionId) => {
    try {
        const response = await api.get(`/session/${sessionId}/progress`);
        const lastPage = response.data.last_page || 0;
        
        // Для прогресса в процентах нужно знать общее количество страниц книги
        // Сначала получим сессию, чтобы узнать book_id
        const sessionResponse = await api.get(`/session/info/${sessionId}`);
        const bookId = sessionResponse.data.book_id;
        
        const totalPages = localStorage.getItem(`book_${bookId}_total_pages`);
        if (totalPages && parseInt(totalPages) > 0) {
            const progress = Math.round((lastPage / parseInt(totalPages)) * 100);
            return Math.min(progress, 100);
        }
        return 0;
    } catch (error) {
        console.error('Error getting session progress:', error);
        return 0;
    }
};

export const getSessionNotifications = async (offset = 0, limit = 10) => {
  const response = await api.post('/session/notifications', {
    offset: offset,
    limit: limit
  });
  return response.data;
};



export const getSessionParticipantsCount = async (sessionId) => {
    try {
        const response = await api.get(`/session/${sessionId}`);
        return response.data.length;
    } catch (error) {
        console.error('Error getting participants count:', error);
        return 1;
    }
};

export const getSessionNotesCount = async (sessionId) => {
    try {
        const response = await api.get('/session/note/', {
            params: { session_id: sessionId }
        });
        return response.data.length;
    } catch (error) {
        console.error('Error getting notes count:', error);
        return 0;
    }
};


export const updateSessionProgress = async (sessionId, page) => {
    try {
        await api.post(`/session/${sessionId}/progress`, {
            last_page: page
        });
    } catch (error) {
        console.error('Error saving session progress:', error);
    }
};

// Заметки в сессии
export const getSessionNotes = async (sessionId) => {
  const response = await api.get('/session/note/', {
    params: { session_id: sessionId }
  });
  return response.data;
};

export const getSessionQuotes = async (sessionId) => {
  const response = await api.get('/session/quote/', {
    params: { session_id: sessionId }
  });
  return response.data;
};

export const getSessionAnnotations = async (sessionId) => {
  const [notes, quotes] = await Promise.all([
    getSessionNotes(sessionId),
    getSessionQuotes(sessionId)
  ]);
  return { notes, quotes };
};

export const createSessionNote = async (data) => {
  const response = await api.post('/session/note/create', data);
  return response.data;
};

export const createSessionQuote = async (data) => {
  const response = await api.post('/session/quote/create', data);
  return response.data;
};
export const updateSessionNote = async (data) => {
  const response = await api.post('/session/note/update', data);
  return response.data;
};

export const updateSessionQuote = async (data) => {
  const response = await api.post('/session/quote/update', data);
  return response.data;
};

export const deleteSessionNote = async (noteId, sessionId) => {
  const response = await api.post('/session/note/delete', {
    id: noteId,
    session_id: sessionId
  });
  return response.data;
};

export const deleteSessionQuote = async (quoteId, sessionId) => {
  const response = await api.post('/session/quote/delete', {
    id: quoteId,
    session_id: sessionId
  });
  return response.data;
};

// Ответы
export const createAnswer = async (noteId, content, sessionId) => {
  const response = await api.post('/answer/create', {
    note_id: noteId,
    content: content,
    session_id: sessionId
  });
  return response.data;
};

export const getAnswersByNoteId = async (noteId) => {
    const response = await api.get('/answer/', {
        params: { note_id: noteId }
    });
    return response.data;
};
export const updateAnswer = async (answerId, content, sessionId, noteId) => {
  const response = await api.patch('/answer/update', {
    id: answerId,
    content: content,
    session_id: sessionId,
    note_id: noteId
  });
  return response.data;
};

export const deleteAnswer = async (answerId, sessionId, noteId) => {
  const response = await api.post('/answer/delete', {
    id: answerId,
    session_id: sessionId,
    note_id: noteId
  });
  return response.data;
};

// НАСТРОЙКИ

// Получение настроек текущего пользователя
export const getUserSettings = async () => {
    try {
        const response = await api.get('/user/profile');
        const settings = {
            font_size: response.data.font_size || 14,
            background_color: response.data.background_color || 'light'
        };
        return settings;
    } catch (error) {
        console.error('Error loading user settings:', error);
        return { font_size: 14, background_color: 'light' };
    }
};

// Обновление настроек пользователя
export const updateUserSettings = async (settings) => {
    localStorage.setItem('reader_settings', JSON.stringify(settings));
    
    const response = await api.patch('/user/', {
        font_size: settings.font_size,
        background_color: settings.background_color
    });
    return response.data;
};

export const updateParticipantRole = async (sessionId, userId, roleId) => {
    const response = await api.put(`/session/${sessionId}/users/${userId}`, {
        role_id: roleId
    });
    return response.data;
};
//  ПОЛЬЗОВАТЕЛЬ 

export const getUserProfile = async () => {
  const response = await api.get('/user/profile');
  return {
    id: response.data.id,
    name: response.data.name,
    last_name: response.data.last_name,
    email: response.data.email,
    background_color: response.data.background_color,
    font_size: response.data.font_size
  };
};

export const updateUserProfile = async (userData) => {
  console.log('updateUserProfile received:', userData);
  const response = await api.patch('/user/', userData);
  return response.data;
};

// ПОИСК

export const searchBooks = async (query) => {
  console.log('searchBooks called with query:', query);
  const books = await getBooks();
  console.log('All books:', books);
  const lowerQuery = query.toLowerCase();
  const filtered = books.filter(book => 
    book.title.toLowerCase().includes(lowerQuery) || 
    book.author.toLowerCase().includes(lowerQuery)
  );
  console.log('Filtered books:', filtered);
  return filtered;
};

export const searchSessions = async (query) => {
  console.log('searchSessions called with query:', query);
  const sessions = await getSessions();
  console.log('All sessions:', sessions);
  const lowerQuery = query.toLowerCase();
  const filtered = sessions.filter(session => 
    session.name.toLowerCase().includes(lowerQuery)
  );
  console.log('Filtered sessions:', filtered);
  return filtered;
};

export const searchAll = async (query) => {
  const [books, sessions] = await Promise.all([
    searchBooks(query),
    searchSessions(query)
  ]);
  return { books, sessions };
};

//УВЕДОМЛЕНИЯ
export const getRecentAnswers = async (limit = 10) => {
    const response = await api.get('/answer/recent', {
        params: { limit }
    });
    return response.data;
};

// Получение последних сессий пользователя
export const getRecentSessions = async (limit = 3) => {
    try {
        const sessions = await getSessions();
        const sorted = sessions.sort((a, b) => b.id - a.id);
        const recent = sorted.slice(0, limit);
        
        // Загружаем информацию о книгах для каждой сессии
        const result = [];
        for (const session of recent) {
            try {
                const book = await getBookById(session.book_id);
                result.push({
                    id: session.id,
                    name: session.name,
                    book_title: book.title,
                    book_author: book.author,
                    book_cover: book.cover_img,
                    members: 0, 
                    notes: 0,   
                    link: session.link
                });
            } catch (err) {
                console.error('Error loading book for session:', err);
            }
        }
        return result;
    } catch (error) {
        console.error('Error getting recent sessions:', error);
        return [];
    }
};

export const getBookProgress = async (bookId) => {
    try {
        const response = await api.get(`/solo_session/?book_id=${bookId}`);
        if (response.data && response.data.last_position) {
            const totalPages = localStorage.getItem(`book_${bookId}_total_pages`);
            if (totalPages && parseInt(totalPages) > 0) {
                const progress = Math.round((response.data.last_position / parseInt(totalPages)) * 100);
                return Math.min(progress, 100);
            }
        }
        return 0;
    } catch (error) {
        return 0;
    }
};

export const getLastOpenedBook = async () => {
    try {
        const response = await api.get('/solo_session/last');
        if (!response.data || !response.data.book_id) {
            return null;
        }
        const book = await getBookById(response.data.book_id);
        const lastPage = response.data.last_position || 0;
        
        // Получаем общее количество страниц
        const totalPages = localStorage.getItem(`book_${book.id}_total_pages`);
        let progress = 0;
        if (totalPages && parseInt(totalPages) > 0) {
            progress = Math.round((lastPage / parseInt(totalPages)) * 100);
            progress = Math.min(progress, 100);
        }
        
        return {
            id: book.id,
            title: book.title,
            author: book.author,
            progress: progress,
            last_page: lastPage,
            cover_img: book.cover_img
        };
    } catch (error) {
        console.error('Error getting last opened book:', error);
        return null;
    }
};

export const leaveSession = async (sessionId) => {
    const response = await api.post(`/session/${sessionId}/leave`);
    return response.data;
};

export default api;