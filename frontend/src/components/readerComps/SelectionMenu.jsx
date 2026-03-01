import React, { useEffect, useRef } from 'react';

export default function SelectionMenu({ position, onClose, onQuote, onNoteClick, selectedText }) {
  const menuRef = useRef(null);

  // Добавляем обработчик клика вне меню
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
    }};
    
    // Добавляем обработчик при монтировании
    document.addEventListener('mousedown', handleClickOutside);
    
    // Удаляем обработчик при размонтировании
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Перезапускаем эффект, если onClose изменится

    // Если позиция не передана, не рендерим меню
    if (!position) return null;

    // Меню позиционируется над выделением: 
    // top = позиция выделения - 60px
    // left = центр выделения - половина ширины меню (300px/2 = 150px)
    const menuStyle = {
        position: 'fixed',
        top: position.top - 60,
        left: position.left + (position.width / 2) - 150,
        zIndex: 9999
    };

    
    return (
         <div ref={menuRef} style={menuStyle} className="selection-menu">
        <div style={menuStyle} className="selection-menu">
            <div className="bg-beige-2 rounded-2xl border-2 border-accent-1 shadow-xl p-3 flex flex-col gap-2 min-w-[300px]">
                
                {/* выбор цвета цитаты */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-blue font-medium">Цитата:</span>
                    <div className="flex gap-2">
                        {/* Жёлтая цитата */}
                        <button 
                            onClick={() => {
                                onQuote('yellow', selectedText); 
                                onClose();
                            }}
                            className="w-8 h-8 rounded-full bg-yellow-300 hover:ring-2 hover:ring-accent-1 transition-all shadow-sm"
                           
                        />
                        
                        {/* Зелёная цитата */}
                        <button 
                            onClick={() => {
                                onQuote('green', selectedText); 
                                onClose();
                            }}
                            className="w-8 h-8 rounded-full bg-green-300 hover:ring-2 hover:ring-accent-1 transition-all shadow-sm"
                        />
                        
                        {/* Синяя цитата */}
                        <button 
                            onClick={() => {
                                onQuote('blue', selectedText); 
                                onClose();
                            }}
                            className="w-8 h-8 rounded-full bg-blue-300 hover:ring-2 hover:ring-accent-1 transition-all shadow-sm"
                        />
                        
                        {/* Розовая цитата */}
                        <button 
                            onClick={() => {
                                onQuote('pink', selectedText); 
                                onClose();
                            }}
                            className="w-8 h-8 rounded-full bg-pink-300 hover:ring-2 hover:ring-accent-1 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Разделитель */}
                <div className="h-px bg-accent-1/30"></div>

                {/* создание заметки*/}
                <button
                    onClick={() => {
                        onNoteClick();
                        onClose(); // закрытие после нажатия
                    }}
                    className="w-full px-4 py-2 bg-accent-1 text-beige-1 rounded-xl hover:opacity-90 transition-colors text-sm font-medium"
                >
                    Создать заметку
                </button>
            </div>
        </div>
        </div>
    );
}
