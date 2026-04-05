import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../../services/api';
import '../../styles/components/modal.css';
import '../../styles/components/reader.css';

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
            if (window.preserveHighlights) {
                window.preserveHighlights();
            }
            
            await updateUserSettings(settings);
            localStorage.setItem('reader_settings', JSON.stringify(settings));
            
            applyThemeToBody(settings.background_color);
            
            window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }));
            
            if (onSettingsApplied) {
                onSettingsApplied(settings);
            }
            
            setTimeout(() => {
              if (window.restoreHighlights) {
                window.restoreHighlights();
              }
              if (window.refreshAllHighlights) {
                window.refreshAllHighlights();
              }
              if (window.forceApplyStyles) {
                window.forceApplyStyles();
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

    const applyThemeToBody = (theme) => {
        document.body.classList.remove('reader-theme-light', 'reader-theme-dark', 'reader-theme-beige');
        document.body.classList.add(`reader-theme-${theme}`);
        localStorage.setItem('reader_theme', theme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem('reader_theme') || 'light';
        if (savedTheme !== settings.background_color) {
            setSettings(prev => ({ ...prev, background_color: savedTheme }));
        } else {
            applyThemeToBody(settings.background_color);
        }
    }, []);

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
            if (window.forceApplyStyles) {
              window.forceApplyStyles();
            }
        }, 50);
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-backdrop"></div>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Настройки читалки</h3>
                    <button onClick={handleClose} className="modal-close">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                
                <div className="form-group">
                    <label className="form-label">Размер шрифта</label>
                    <div className="settings-font-grid">
                        {fontSizes.map(size => (
                            <button
                                key={size.value}
                                onClick={() => handleFontSizeChange(size.value)}
                                className={`settings-option ${size.previewClass} ${
                                    settings.font_size === size.value ? 'settings-option-active' : ''
                                }`}
                            >
                                {size.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Цвет фона</label>
                    <div className="settings-bg-grid">
                        {bgColors.map(color => (
                            <button
                                key={color.value}
                                onClick={() => handleBgColorChange(color.value)}
                                className={`settings-bg-option ${color.bgClass} ${color.textClass} ${
                                    settings.background_color === color.value ? 'settings-bg-option-active' : ''
                                }`}
                            >
                                {color.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="settings-preview" style={{ backgroundColor: bgColors.find(c => c.value === settings.background_color)?.previewBg }}>
                    <p className="preview-label">Предпросмотр:</p>
                    <p style={{ fontSize: `${settings.font_size}px` }}>
                        Это пример текста с выбранными настройками.
                    </p>
                </div>

                <div className="form-actions">
                    <button onClick={handleSave} disabled={loading} className="form-button-submit">
                        {loading ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button onClick={handleClose} className="form-button-cancel">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
}