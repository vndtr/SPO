// frontend/src/pages/ProfileView.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/mainComps/Header.jsx';
import NavAside from '../components/mainComps/NavAside.jsx';
import { getUserProfile, updateUserProfile, logout, getCurrentUser } from '../services/api';

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
        <div className='flex'>
          <NavAside />
          <div className='bg-beige-1 flex flex-col text-accent-2 w-screen p-10'>
            <div className="text-center py-20">Загрузка...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='flex'>
        <NavAside />
        <div className='bg-beige-1 flex text-accent-2 w-screen p-10'>
          <div className='flex-3 text-blue w-full'>
            <h1 className='text-3xl mb-6'>Профиль</h1>
            
            <div className='flex w-full bg-beige-2 rounded-2xl p-4 m-2'>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" fill="currentColor" className="bi bi-circle-fill text-accent-1/50" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="8"/>
                </svg>
              </div>
              
              <div className='mx-10 min-w-[20vw] m-auto'>
                <div className='text-2xl m-2 flex text-blue gap-4'>
                  <input
                    name="last_name"
                    type="text"
                    disabled={!isEditing}
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder='Фамилия'
                    className={`${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
                  />
                  <input
                    name="name"
                    type="text"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder='Имя'
                    className={`${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
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
                    className={`${!isEditing ? "bg-beige-2 cursor-not-allowed" : "bg-white"} min-w-[10vw] rounded-2xl border border-accent-1/30 p-2 focus:outline-none focus:ring-2 focus:ring-accent-1`}
                  />
                </div>
              </div>
              
              <div className='flex flex-col items-end justify-between w-full gap-2'>
                <div className='flex gap-2'>
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="cursor-pointer bg-accent-1 text-beige-1 rounded-2xl px-4 py-2 hover:opacity-90 transition-colors disabled:opacity-50"
                      >
                        {saving ? 'Сохранение...' : 'Сохранить'}
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
                
                <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-red-500 text-white rounded-2xl px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Выйти из системы
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}