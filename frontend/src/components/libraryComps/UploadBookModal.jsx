import React, { useState } from 'react';

export default function UploadBookModal({ onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Проверяем расширение
      if (!selectedFile.name.toLowerCase().endsWith('.epub')) {
        alert('Можно загружать только EPUB файлы');
        return;
      }
      setFile(selectedFile);
      
      // Если название не введено, пробуем взять из имени файла
      if (!title) {
        const fileName = selectedFile.name.replace('.epub', '');
        setTitle(fileName);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Выберите файл');
      return;
    }
    
    if (!title.trim()) {
      alert('Введите название книги');
      return;
    }
    
    if (!author.trim()) {
      alert('Введите автора');
      return;
    }
    
    setLoading(true);
    try {
      await onUpload(file, title, author);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div 
        className="bg-beige-1 p-6 rounded-2xl max-w-md w-full text-blue flex flex-col gap-4 border border-accent-1 shadow-2xl relative z-[10001]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-medium">Загрузка книги</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Выбор файла */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Файл EPUB</label>
            <div className="relative">
              <input
                type="file"
                accept=".epub"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full px-4 py-3 border border-accent-1/30 rounded-xl bg-beige-2 flex items-center justify-between">
                <span className="text-sm truncate">
                  {file ? file.name : 'Выберите файл...'}
                </span>
                <span className="text-xs text-accent-1">Обзор</span>
              </div>
            </div>
          </div>

          {/* Название книги */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Название книги</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название"
              className="w-full px-4 py-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
              required
            />
          </div>

          {/* Автор */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Автор</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Введите автора"
              className="w-full px-4 py-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
              required
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 justify-end mt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Загрузка...' : 'Загрузить'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-accent-1 text-accent-1 rounded-xl hover:bg-accent-1/10 transition"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}