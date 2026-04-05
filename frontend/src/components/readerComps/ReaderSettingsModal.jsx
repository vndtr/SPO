// frontend/src/components/readerComps/ReaderSettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../../services/api';

export default function ReaderSettingsModal({ onClose, onSettingsApplied }) {
    const [settings, setSettings] = useState({
        font_size: 14,
        background_color: 'light'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const userSettings = await getUserSettings();
            setSettings(userSettings);
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const handleFontSizeChange = (size) => {
        setSettings(prev => ({ ...prev, font_size: size }));
    };

    const handleBgColorChange = (color) => {
        setSettings(prev => ({ ...prev, background_color: color }));
    };

    const handleSave = async () => {
    setLoading(true);
    try {
        // Сохраняем подсветки перед изменением
        if (window.preserveHighlights) {
            window.preserveHighlights();
        }
        
        await updateUserSettings(settings);
        localStorage.setItem('reader_settings', JSON.stringify(settings));
        
        window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
        
        if (onSettingsApplied) {
            onSettingsApplied(settings);
        }
        
        // Восстанавливаем подсветки после применения
        setTimeout(() => {
            if (window.restoreHighlights) {
                window.restoreHighlights();
            }
            if (window.refreshAllHighlights) {
                window.refreshAllHighlights();
            }
        }, 100);
        
        onClose();
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Ошибка при сохранении настроек');
    } finally {
        setLoading(false);
    }
};

    const fontSizes = [
        { value: 12, label: 'Маленький', previewClass: 'text-xs' },
        { value: 14, label: 'Средний', previewClass: 'text-sm' },
        { value: 16, label: 'Большой', previewClass: 'text-base' },
        { value: 18, label: 'Очень большой', previewClass: 'text-lg' }
    ];

    const bgColors = [
        { value: 'light', label: 'Светлый', bgClass: 'bg-white', textClass: 'text-gray-900', previewBg: '#ffffff' },
        { value: 'dark', label: 'Тёмный', bgClass: 'bg-gray-800', textClass: 'text-gray-100', previewBg: '#2a2a2a' },
        { value: 'beige', label: 'Бежевый', bgClass: 'bg-amber-50', textClass: 'text-gray-700', previewBg: '#f5f0e8' }
    ];

 

const handleClose = () => {
    // Сохраняем подсветки перед закрытием
    if (window.preserveHighlights) {
        window.preserveHighlights();
    }
    
    onClose();
    
    // Восстанавливаем подсветки после закрытия
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
                        {fontSizes.map(size => (
                            <button
                                key={size.value}
                                onClick={() => handleFontSizeChange(size.value)}
                                className={`p-3 rounded-xl border-2 transition-all ${size.previewClass} ${
                                    settings.font_size === size.value
                                        ? 'border-accent-1 bg-accent-1/10'
                                        : 'border-accent-1/30 hover:border-accent-1/50'
                                }`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Цвет фона */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Цвет фона</label>
                    <div className="grid grid-cols-3 gap-2">
                        {bgColors.map(color => (
                            <button
                                key={color.value}
                                onClick={() => handleBgColorChange(color.value)}
                                className={`p-3 rounded-xl border-2 transition-all ${color.bgClass} ${color.textClass} ${
                                    settings.background_color === color.value
                                        ? 'border-accent-1 ring-2 ring-accent-1/50'
                                        : 'border-accent-1/30'
                                }`}
                            >
                                {color.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Предпросмотр */}
                <div className="mt-2 p-3 rounded-xl border border-accent-1/30" style={{ backgroundColor: bgColors.find(c => c.value === settings.background_color)?.previewBg }}>
                    <p className="text-sm text-gray-600 mb-1">Предпросмотр:</p>
                    <p style={{ fontSize: `${settings.font_size}px` }}>
                        Это пример текста с выбранными настройками.
                    </p>
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
                        onClick={handleClose}
                        className="px-4 py-2 border border-accent-1 text-accent-1 rounded-xl hover:bg-accent-1/10 transition"
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}