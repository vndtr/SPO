import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import '../styles/pages/login.css';

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
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">
          {isLogin ? 'Вход' : 'Регистрация'}
        </h2>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Имя пользователя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="login-input"
            required
          />

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="login-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
            </>
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="login-toggle"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}