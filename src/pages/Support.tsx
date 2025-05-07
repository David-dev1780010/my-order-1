import React, { useState } from 'react';

const MAX_LENGTH = 560;

const Support: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    // Получаем профиль пользователя из Telegram WebApp API
    const tgUser: any = window.Telegram?.WebApp?.initDataUnsafe?.user || {};
    const user_id = tgUser.id;
    const username = tgUser.username || '';
    const usertag = tgUser.username || '';
    const savedUsername = tgUser.first_name || '';
    if (!user_id || !usertag) {
      setError('Не удалось получить данные Telegram. Откройте мини-приложение через Telegram.');
      setLoading(false);
      return;
    }
    if (message.trim().length < 1) {
      setError('Пожалуйста, опишите ваш запрос.');
      setLoading(false);
      return;
    }
    if (message.length > MAX_LENGTH) {
      setError(`Максимальная длина сообщения — ${MAX_LENGTH} символов.`);
      setLoading(false);
      return;
    }
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      if (!API_URL) {
        setError('Ошибка конфигурации: адрес сервера не задан.');
        setLoading(false);
        return;
      }
      console.log('Support API_URL:', API_URL);
      const res = await fetch(`${API_URL}/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, usertag, username, message, savedUsername })
      });
      if (res.ok) {
        setSuccess('Ваш запрос успешно отправлен в поддержку!');
        setMessage('');
      } else {
        setError('Ошибка отправки. Попробуйте позже.');
      }
    } catch {
      setError('Ошибка соединения с сервером.');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none' }}>
      <div style={{ background: '#2D1E5A', borderRadius: 40, padding: '36px 18px', maxWidth: 400, width: '100%', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)' }}>
        <h2 style={{ color: 'white', fontSize: 32, fontWeight: 500, textAlign: 'center', marginBottom: 28, fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif' }}>Поддержка</h2>
        <textarea
          style={{
            width: '100%',
            minHeight: 100,
            maxHeight: 180,
            background: '#584C7D',
            border: 'none',
            borderRadius: 24,
            color: 'white',
            fontSize: 18,
            padding: 18,
            marginBottom: 18,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
          maxLength={MAX_LENGTH}
          placeholder="Опишите ваш запрос"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <div style={{ color: '#BEB8D1', fontSize: 14, marginBottom: 10, textAlign: 'right' }}>{message.length}/{MAX_LENGTH}</div>
        {error && <div style={{ color: '#FF6B6B', marginBottom: 10, textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#09FBD3', marginBottom: 10, textAlign: 'center' }}>{success}</div>}
        <button
          style={{
            width: '100%',
            background: '#B6116B',
            color: 'white',
            border: 'none',
            borderRadius: 20,
            fontSize: 20,
            fontWeight: 500,
            padding: '16px 0',
            marginBottom: 16,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10
          }}
          disabled={loading}
          onClick={handleSend}
        >
          <span role="img" aria-label="mail">📩</span> Отправить в поддержку
        </button>
        <div style={{ color: 'white', textAlign: 'center', fontSize: 18, marginTop: 8 }}>
          @neo_mailers2
        </div>
      </div>
    </div>
  );
};

export default Support; 