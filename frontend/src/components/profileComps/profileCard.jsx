import React, { useState } from 'react';

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Загружаем сохраненные данные 
  React.useEffect(() => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Сохраняем в localStorage
    localStorage.setItem('profileData', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Отменяем редактирование и загружаем сохраненные данные
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setIsEditing(false);
  };

  return (
    <div className='flex w-full bg-beige-2 rounded-2xl p-4 m-2'>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-circle-fill" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="8"/>
        </svg>
      </div>
      <div className='mx-10 min-w-[20vw] m-auto'>
        <div className='text-2xl m-2 flex text-blue gap-4'>
          <input
            name="lastName"
            type="text"
            disabled={!isEditing}
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder='Фамилия'
            className={` ${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
          />
          <input
            name="firstName"
            type="text"
            disabled={!isEditing}
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder='Имя'
            className={` ${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
          />
        </div>
        <div className='m-2'>
          <input
            name="email"
            type="email"
            disabled={!isEditing}
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Email'
            className={` ${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
          />
        </div>
      </div>
      <div className='flex items-start justify-end w-full gap-2'>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="cursor-pointer bg-accent-1 text-beige-1 rounded-2xl px-4 py-2 hover:opacity-90 transition-colors"
            >
              Сохранить
            </button>
            <button
              onClick={handleCancel}
              className="cursor-pointer bg-gray-300 text-gray-700 rounded-2xl px-4 py-2 hover:bg-gray-400 transition-colors"
            >
              Отмена
            </button>
          </>
        ) : (
          <button
            onClick={handleEdit}
            className="cursor-pointer bg-accent-1 text-beige-1 rounded-2xl px-4 py-2 hover:opacity-90 transition-colors"
          >
            Редактировать
          </button>
        )}
      </div>
    </div>
  );
}