import React, { useState, useEffect } from 'react';
import { getReaderSettings, updateReaderSettings, getCurrentUser } from '../../services/api';

export default function ReaderSettingsModal({ onClose, userId, onSettingsChange }) {
  const [settings, setSettings] = useState({
    font_size: 'medium',
    background_color: 'light'
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);  // ← убрать userId из зависимостей, так как он может быть undefined

  const loadSettings = async () => {
    const user = await getCurrentUser();
    if (user?.user_id) {
      try {
        const settingsData = await getReaderSettings(user.user_id);
        setSettings(settingsData);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const handleSave = async () => {
    const user = await getCurrentUser();
    if (!user?.user_id) return;
    
    setLoading(true);
    try {
      await updateReaderSettings(user.user_id, settings);
      if (onSettingsChange) {
        onSettingsChange(settings);
      }
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fontSizes = {
    'small': { label: 'Маленький', className: 'text-sm' },
    'medium': { label: 'Средний', className: 'text-base' },
    'large': { label: 'Большой', className: 'text-lg' },
    'extra-large': { label: 'Очень большой', className: 'text-xl' }
  };

  const backgroundColors = {
    'light': { label: 'Светлый', className: 'bg-white', textColor: 'text-gray-900' },
    'dark': { label: 'Тёмный', className: 'bg-gray-900', textColor: 'text-gray-100' },
    'beige': { label: 'Бежевый', className: 'bg-amber-50', textColor: 'text-gray-900' }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div 
        className="bg-beige-1 p-6 rounded-2xl max-w-md w-full text-blue flex flex-col gap-4 border border-accent-1 shadow-2xl relative z-[10001]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-medium">Настройки читалки</h3>
        
        {/* Размер шрифта */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Размер шрифта</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(fontSizes).map(([key, { label, className: fontClassName }]) => (
              <button
                key={key}
                onClick={() => handleChange('font_size', key)}
                className={`p-3 rounded-xl border-2 transition-all ${fontClassName} ${
                  settings.font_size === key
                    ? 'border-accent-1 bg-accent-1/10'
                    : 'border-accent-1/30 hover:border-accent-1/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Цвет фона */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Цвет фона</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(backgroundColors).map(([key, { label, className: bgClassName, textColor }]) => (
              <button
                key={key}
                onClick={() => handleChange('background_color', key)}
                className={`p-3 rounded-xl border-2 transition-all ${bgClassName} ${textColor} ${
                  settings.background_color === key
                    ? 'border-accent-1 ring-2 ring-accent-1/50'
                    : 'border-accent-1/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-4 justify-end mt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-accent-1 text-accent-1 rounded-xl hover:bg-accent-1/10 transition"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}