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

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '22px 0',
    borderRadius: '40px',
    backgroundColor: '#B6116B',
    color: 'white',
    border: 'none',
    fontSize: '38px',
    fontWeight: 500,
    marginBottom: '32px',
    fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
    cursor: 'pointer',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
  };

  const dotStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#B6116B',
    margin: '0 18px',
    flexShrink: 0,
  };

  const otherButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    fontSize: '26px',
    padding: '12px 0',
    marginBottom: 0,
    borderRadius: '22px',
  };
  const otherDotStyle: React.CSSProperties = {
    ...dotStyle,
    width: 10,
    height: 10,
    margin: '0 8px',
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
          maxWidth: '540px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{
          color: 'white',
          fontSize: '32px',
          marginBottom: '40px',
          fontWeight: '500',
          fontFamily: 'Montserrat Alternates, -apple-system, BlinkMacSystemFont, sans-serif',
          textAlign: 'center',
          lineHeight: 1.2
        }}>
          Выберите услугу<br />дизайна
        </h1>
        {/* Кнопки с точками */}
        <div style={{width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 32}}>
            <div style={dotStyle}></div>
            <button style={buttonStyle}>GFX баннер</button>
            <div style={dotStyle}></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 32}}>
            <div style={dotStyle}></div>
            <button style={buttonStyle}>GFX анимация</button>
            <div style={dotStyle}></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 32}}>
            <div style={dotStyle}></div>
            <button style={buttonStyle}>GFX аватарка</button>
            <div style={dotStyle}></div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', marginBottom: 0}}>
            <div style={otherDotStyle}></div>
            <button style={otherButtonStyle} onClick={handleOtherClick}>Другое...</button>
            <div style={otherDotStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order; 