// frontend/src/pages/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import { getUserProfile, updateUserProfile, logout, getCurrentUser } from '../services/api';
import '../styles/pages/profile.css';

export default function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    last_name: '',
    email: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const profile = await getUserProfile();
      console.log('Loaded profile:', profile);
      setUserData(profile);
      setFormData({
        name: profile.name || '',
        last_name: profile.last_name || '',
        email: profile.email || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = {};
      
      if (formData.name !== userData.name && formData.name.trim()) {
        updateData.name = formData.name;
      }
      if (formData.last_name !== userData.last_name) {
        updateData.last_name = formData.last_name;
      }
      if (formData.email !== userData.email && formData.email.trim()) {
        updateData.email = formData.email;
      }
      
      console.log('Update data being sent:', JSON.stringify(updateData, null, 2));
      
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }
      
      const response = await updateUserProfile(updateData);
      console.log('Update response:', response);
      
      setUserData(formData);
      setIsEditing(false);
      alert('Профиль успешно обновлен');
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
      }
      alert('Ошибка при сохранении профиля');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name || '',
      last_name: userData.last_name || '',
      email: userData.email || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="profile-layout">
          <NavAside />
          <div className="profile-container">
            <div className="profile-loading">Загрузка...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="profile-layout">
        <NavAside />
        <div className="profile-container">
          <h1 className="profile-title">Профиль</h1>
          
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
                  name="last_name"
                  type="text"
                  disabled={!isEditing}
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Фамилия"
                  className={`profile-input ${!isEditing ? 'profile-input-disabled' : ''}`}
                />
                <input
                  name="name"
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
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
                      disabled={saving}
                      className="profile-button"
                    >
                      {saving ? 'Сохранение...' : 'Сохранить'}
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
              
              <button
                onClick={handleLogout}
                className="profile-logout-button"
              >
                Выйти из системы
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}