import React, { useState } from 'react';

const MAX_LENGTH = 560;

const Support: React.FC = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Получаем username из localStorage
  let username = '';
  try {
    const profile = localStorage.getItem('userProfile');
    if (profile) {
      username = JSON.parse(profile).savedUserTag || '';
    }
  } catch {}

  const handleSend = async () => {
    setError(null);
    setSuccess(null);
    if (!username) {
      setError('Для обращения в поддержку у вас должен быть установлен username в Telegram.');
      return;
    }
    if (message.trim().length < 1) {
      setError('Пожалуйста, опишите ваш запрос.');
      return;
    }
    if (message.length > MAX_LENGTH) {
      setError(`Максимальная длина сообщения — ${MAX_LENGTH} символов.`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message }),
      });
      if (res.ok) {
        setSuccess('Ваш запрос успешно отправлен в поддержку!');
        setMessage('');
      } else {
        setError('Ошибка при отправке. Попробуйте позже.');
      }
    } catch {
      setError('Ошибка соединения с сервером.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        background: '#2D1E5A',
        borderRadius: 36,
        padding: '36px 18px',
        maxWidth: 400,
        width: '100%',
        margin: '0 auto',
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          color: 'white',
          fontSize: 28,
          fontWeight: 600,
          textAlign: 'center',
          marginBottom: 24,
        }}>Поддержка</h2>
        <textarea
          value={message}
          onChange={e => {
            if (e.target.value.length <= MAX_LENGTH) setMessage(e.target.value);
          }}
          placeholder="Опишите ваш запрос"
          style={{
            width: '100%',
            minHeight: 100,
            maxHeight: 180,
            background: '#584C7D',
            border: 'none',
            borderRadius: 22,
            color: 'white',
            fontSize: 18,
            padding: '18px 16px',
            marginBottom: 18,
            resize: 'vertical',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          maxLength={MAX_LENGTH}
        />
        <div style={{ color: '#BEB8D1', fontSize: 14, alignSelf: 'flex-end', marginBottom: 8 }}>
          {message.length}/{MAX_LENGTH}
        </div>
        {error && <div style={{ color: '#FF6B6B', marginBottom: 10, textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#09FBD3', marginBottom: 10, textAlign: 'center' }}>{success}</div>}
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            width: '100%',
            background: '#B6116B',
            color: 'white',
            border: 'none',
            borderRadius: 18,
            fontSize: 18,
            fontWeight: 500,
            padding: '16px 0',
            marginBottom: 18,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span role="img" aria-label="mail">📩</span> Отправить в поддержку
        </button>
        <div style={{ color: 'white', fontSize: 17, textAlign: 'center', marginTop: 6 }}>
          @neo_mailers2
        </div>
      </div>
    </div>
  );
};

export default Support; 