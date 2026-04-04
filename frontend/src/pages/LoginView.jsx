import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';

export default function LoginView({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await login(name, password);
        
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
          console.log('Token saved, user_id:', response.user_id);
          if (onLogin) onLogin();
          navigate('/');
        } else {
          setError('Не удалось получить токен');
        }
      } else {
        await register({ name, last_name: lastName, email, password });
        const response = await login(name, password);
        localStorage.setItem('access_token', response.access_token);
        if (onLogin) onLogin();
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data);
      setError(err.response?.data?.detail || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-beige-1">
      <div className="bg-beige-2 p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-blue mb-6">
          {isLogin ? 'Вход' : 'Регистрация'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mb-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
            required
          />

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 mb-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-3 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 border border-accent-1/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-1"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-1 text-beige-1 py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-accent-1 hover:underline text-sm"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}