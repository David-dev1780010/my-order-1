import React from 'react';

const circleStyle = {
  width: 12,
  height: 12,
  background: '#B6116B',
  borderRadius: '50%',
  display: 'inline-block',
  margin: '0 8px',
  verticalAlign: 'middle',
};

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
        {/* Кнопки с кругами */}
        {["GFX баннер", "GFX анимация", "GFX аватарка"].map((text) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: 18 }}>
            <span style={circleStyle} />
            <button style={{
              width: '85%',
              padding: '16px',
              borderRadius: '24px',
              backgroundColor: '#B6116B',
              color: 'white',
              border: 'none',
              fontSize: '28px',
              fontWeight: '500',
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              cursor: 'pointer',
              position: 'relative',
              display: 'block',
              textAlign: 'center',
            }}>{text}</button>
            <span style={circleStyle} />
          </div>
        ))}
        {/* Кнопка другое... */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginTop: 10 }}>
          <span style={{ ...circleStyle, width: 8, height: 8, margin: '0 6px' }} />
          <button
            onClick={handleOtherClick}
            style={{
              width: '55%',
              padding: '10px',
              borderRadius: '16px',
              backgroundColor: '#B6116B',
              color: 'white',
              border: 'none',
              fontSize: '20px',
              fontWeight: '500',
              fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
              cursor: 'pointer',
              position: 'relative',
              display: 'block',
              textAlign: 'center',
            }}
          >
            Другое...
          </button>
          <span style={{ ...circleStyle, width: 8, height: 8, margin: '0 6px' }} />
        </div>
      </div>
    </div>
  );
};

export default Order; 