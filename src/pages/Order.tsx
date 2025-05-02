import React from 'react';

const Order: React.FC = () => {
  // Обработчик для кнопки "Другое..."
  const handleOtherClick = () => {
    if (window.Telegram && window.Telegram.WebApp && (window.Telegram.WebApp as any).showAlert) {
      (window.Telegram.WebApp as any).showAlert('Функция временно не доступна');
    } else {
      alert('Функция временно не доступна');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '20px',
      paddingTop: '100px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden'
    }}>
      <div
        style={{
          backgroundColor: '#2D1E5A',
          borderRadius: '25px',
          padding: '30px 20px',
          width: '100%',
          maxWidth: '340px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{
          color: 'white',
          fontSize: '28px',
          marginBottom: '32px',
          fontWeight: '500',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Выберите услугу<br />дизайна
        </h1>
        <button style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#B6116B',
          color: 'white',
          border: 'none',
          fontSize: '22px',
          fontWeight: '500',
          marginBottom: '18px',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          cursor: 'pointer',
          position: 'relative'
        }}>
          GFX баннер
        </button>
        <button style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#B6116B',
          color: 'white',
          border: 'none',
          fontSize: '22px',
          fontWeight: '500',
          marginBottom: '18px',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          cursor: 'pointer',
          position: 'relative'
        }}>
          GFX анимация
        </button>
        <button style={{
          width: '100%',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#B6116B',
          color: 'white',
          border: 'none',
          fontSize: '22px',
          fontWeight: '500',
          marginBottom: '18px',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          cursor: 'pointer',
          position: 'relative'
        }}>
          GFX аватарка
        </button>
        <button
          onClick={handleOtherClick}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: '#B6116B',
            color: 'white',
            border: 'none',
            fontSize: '20px',
            fontWeight: '500',
            marginBottom: '0',
            fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          Другое...
        </button>
      </div>
    </div>
  );
};

export default Order; 