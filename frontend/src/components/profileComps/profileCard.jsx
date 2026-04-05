import React, { useState, useEffect } from 'react';
import '../../styles/pages/profile.css';

export default function ProfileCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
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
    localStorage.setItem('profileData', JSON.stringify(formData));
    setIsEditing(false);
  };

  const handleCancel = () => {
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    setIsEditing(false);
  };

  return (
    <div className="profile-card">
      <div className="profile-avatar">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="128" 
          height="128" 
          fill="currentColor" 
          className="profile-avatar-svg" 
          viewBox="0 0 16 16"
        >
          <circle cx="8" cy="8" r="8"/>
        </svg>
      </div>
      
      <div className="profile-form">
        <div className="profile-name-group">
          <input
            name="lastName"
            type="text"
            disabled={!isEditing}
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Фамилия"
            className={`profile-input ${!isEditing ? 'profile-input-disabled' : ''}`}
          />
          <input
            name="firstName"
            type="text"
            disabled={!isEditing}
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Имя"
            className={`profile-input ${!isEditing ? 'profile-input-disabled' : ''}`}
          />
        </div>
        
        <div className="profile-field-group">
          <input
            name="email"
            type="email"
            disabled={!isEditing}
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className={`profile-input ${!isEditing ? 'profile-input-disabled' : ''}`}
          />
        </div>
      </div>
      
      <div className="profile-actions">
        <div className="profile-buttons">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="profile-button"
              >
                Сохранить
              </button>
              <button
                onClick={handleCancel}
                className="profile-button-cancel"
              >
                Отмена
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="profile-button"
            >
              Редактировать
            </button>
          )}
        </div>
      </div>
    </div>
  );
}